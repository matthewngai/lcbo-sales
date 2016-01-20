var execFile = require('child_process').execFile;
var execFileSync = require('child_process').execFileSync;
var mongoose = require('mongoose');
var async = require('async');
var querystring = require('querystring');
var _ = require('lodash');
var q = require('q');
var cheerio = require('cheerio');

var Product = require('../models/product');

var url = 'http://www.lcbo.com/webapp/wcs/stores/servlet/CategoryNavigationResultsView';
var form = {
  contentBeginIndex: 0,
  productBeginIndex: 50,
  beginIndex: 50,
  categoryPath: '//',
  storeId: 10151,
  catalogId: 10001,
  langId: -1,
  requesttype: 'ajax'
};

var makeFormData = function(start) {
  var formData = _.clone(form);
  formData.productBeginIndex = formData.beginIndex = start;
  return querystring.stringify(formData);
}

var getTotalCount = function(result) {
  $ = cheerio.load(result);
  return Number($('span.count').text().trim().split(/\D/)[0]);
}

var parseResult = function(result) {
  $ = cheerio.load(result);

  var products = $('.product');

  return _.map(products, product => {
    product = $(product);
    var anchor = product.find('.product-name a');

    var info = {
      id: product.attr('data-product-id'),
      name: anchor.text().trim(),
      link: anchor.attr('href'),
      code: product.find('.product-code').text().trim().split('\n')[0].trim(),
      price: product.find('.price').text(),
      savedPrice: product.find('.saved-price').text(),
      country: product.find('.country').text(),
      producer: product.find('.producer').text(),
      airMiles: product.find('.air-miles').text().trim().split('\n')[0].trim(),
      volume: product.find('.plp-volume-grid').text().trim(),
      image: product.find('.product-image').find('img').attr('src'),
    };

    // Check if sale price
    if (!_.isEmpty(info.savedPrice)) {
      info.wasPrice = product.find('.was-price').text().substr(4);
      info.savedPrice = info.savedPrice.substr(5);
    }

    return info;
  });
}

var parseAlcoholVol = function(result) {
  $ = cheerio.load(result);
  var text = $('#item-accordion-aside-product-details').text();
  text = text.substr(text.indexOf('Alcohol/Vol') + 11).trim(); 
  return text.substr(0, text.indexOf('%') + 1);
};

var parseResults = function(deferred, err, results) {
  if (err) {
    console.error(err);
    return deferred.reject(err);
  }

  var parsedResults = _.flatten(_.map(results, parseResult));

  // Get Alcohol/Vol
  var requests = [];
  _.forEach(parsedResults, result => {
    var request = function(callback) {
      var url = 'http://www.lcbo.com' + result.link;
      var args = ['-X GET', '-H "Cache-Control: no-cache', url];
      execFile('curl', args, {}, function (error, stdout, stderr) {
        if (error) {
          console.error('exec error: ' + error);
          return callback(error);
        }
        return callback(null, stdout);
      });
    }
    requests.push(request);
  });
  async.series(requests, (err, results) => {
    if (err) {
      console.error(err);
      deferred.reject(err);
    }
    _.forEach(results, (result, i) => {
      var alcohol = parseAlcoholVol(result);
      parsedResults[i].alcohol = alcohol;
    });
    return deferred.resolve(parsedResults);
  });
}

var request = function(formData, callback) {
  var method = '-X POST';
  var headers = '-H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"';
  var data = '-d ' +  formData;
  var url = 'http://www.lcbo.com/webapp/wcs/stores/servlet/CategoryNavigationResultsView?pageSize=50&manufacturer=&searchType=&resultCatEntryType=&catalogId=10001&categoryId=&langId=-1&storeId=10151&sType=SimpleSearch&filterFacet=&metaData=';

  var args = [method, data, headers, url];
  execFile('curl', args, {}, function (error, stdout, stderr) {
    if (error) {
      console.error('exec error: ' + error);
      return callback(error);
    }
    return callback(null, stdout);
  });
}

var requestSync = function(formData) {
  var method = '-X POST';
  var headers = '-H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"';
  var data = '-d ' +  formData;
  var url = 'http://www.lcbo.com/webapp/wcs/stores/servlet/CategoryNavigationResultsView?pageSize=50&manufacturer=&searchType=&resultCatEntryType=&catalogId=10001&categoryId=&langId=-1&storeId=10151&sType=SimpleSearch&filterFacet=&metaData=';

  var args = [method, data, headers, url];
  return execFileSync('curl', args, {}).toString();
}

var saveProducts = function(products) {
  var deferred = q.defer();
  async.eachSeries(products, (item, callback) => {
    var product = new Product({
      _id: item.id,
      name: item.name,
      link: item.link,
      code: item.code,
      price: item.price,
      savedPrice: item.savedPrice,
      country: item.country,
      producer: item.producer,
      airMiles: item.airMiles,
      volume: item.volume,
      image: item.image,
      alcohol: item.alcohol
    });

    product = product.toObject();
    var id = product._id;
    delete product._id;

    Product.findOneAndUpdate({_id: id}, product, { upsert: true }, (err, p) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      return callback(null);
    });
  }, function(err) {
    if (err) {
      return deferred.reject(err);
    }
    return deferred.resolve();
  });
  return deferred.promise;
}

var getData = function() {
  var deferred = q.defer();

  // Get count
  var form = makeFormData(0);
  request(form, function(error, data) {
    if (error) {
      console.error(error);
      return deferred.reject(error);
    }
    var count = getTotalCount(data);

    if (process.env.DEBUG) {
      count = 1000;
    }

    console.log('Total: ' + count);

    // var requests = [];
    // for (var i = 0; i < count; i += 50) {
    //   var formData = makeFormData(i);
    //   requests.push(function(callback) {
    //     return request(this.formData, callback);
    //   }.bind({formData: formData}));
    // }

    // async.series(requests, parseResults.bind(null, deferred));
    
    var forms = [];
    for (var i = 0; i < count; i += 50) {
      forms.push(makeFormData(i));
    }

    var i = 0;
    async.eachSeries(forms, (formData, callback) => {
      console.log(i += 50);
      var html = requestSync(formData);
      var products = parseResult(html);
      
      saveProducts(products)
        .then(function() {
          callback(null);
        }, function(err) {
          callback(err);
        });
    }, function() {
      deferred.resolve();
    })
  });

  return deferred.promise;
}

var LCBOData = {};

LCBOData.update = function() {
  return getData();
  // var deferred = q.defer();

  // getData().then(function(data) {
  //   _.forEach(data, (item, i) => {
  //     var product = new Product({
  //       _id: item.id,
  //       name: item.name,
  //       link: item.link,
  //       code: item.code,
  //       price: item.price,
  //       savedPrice: item.savedPrice,
  //       country: item.country,
  //       producer: item.producer,
  //       airMiles: item.airMiles,
  //       volume: item.volume,
  //       image: item.image,
  //       alcohol: item.alcohol
  //     });

  //     product = product.toObject();
  //     var id = product._id;
  //     delete product._id;

  //     Product.findOneAndUpdate({_id: id}, product, { upsert: true }, (err, p) => {
  //       if (err) {
  //         console.error(err);
  //         return deferred.reject(err);
  //       }
  //     });
  //   });
  //   return deferred.resolve();
  // });

  // return deferred.promise;
}

LCBOData.getCount = function() {
  var deferred = q.defer();

  Product.find().count((err, count) => {
    if (err) {
      console.error(err);
      return deferred.reject(err);
    }
    return deferred.resolve(count);
  });

  return deferred.promise;
}

LCBOData.get = function(offset, limit) {
  var deferred = q.defer();

  Product.find()
    .skip(offset)
    .limit(limit)
    .find((err, results) => {
      if (err) {
        console.error(err);
        return deferred.reject(err);
      }
      return deferred.resolve(results);
    });

  return deferred.promise;
}

LCBOData.getSaleCount = function() {
  var deferred = q.defer();
  var query = {'savedPrice': { '$ne': ''}};
  Product.find(query).count((err, count) => {
    if (err) {
      console.error(err);
      return deferred.reject(err);
    }
    return deferred.resolve(count);
  });

  return deferred.promise;
}

LCBOData.getOnSale = function(offset, limit) {
  var deferred = q.defer();

  var query = {'savedPrice': { '$ne': ''}};
  Product.find(query)
    .sort('name')
    .skip(offset)
    .limit(limit)
    .find((err, results) => {
      if (err) {
        console.error(err);
        return deferred.reject(err);
      }
      return deferred.resolve(results);
    });

  return deferred.promise;
}

module.exports = LCBOData;