var execFile = require('child_process').execFile;
var mongoose = require('mongoose');
var async = require('async');
var querystring = require('querystring');
var _ = require('lodash');
var q = require('q');
var cheerio = require('cheerio');

var url = 'http://www.lcbo.com/webapp/wcs/stores/servlet/CategoryNavigationResultsView';
var form = {
  contentBeginIndex: 0,
  productBeginIndex: 50,
  beginIndex: 50,
  categoryPath: '//',
  resultType: 'products',
  storeId: 10151,
  catalogId: 10001,
  langId: -1,
  requesttype: 'ajax'
};

var makeFormData = function(start) {
  var formData = _.clone(form);
  formData.contentBeginIndex = start;
  formData.productBeginIndex = formData.beginIndex = start + 49;
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
      execFile('curl.exe', args, {}, function (error, stdout, stderr) {
        if (error) {
          console.error('exec error: ' + error);
          return callback(error);
        }
        return callback(null, stdout);
      });
    }
    requests.push(request);
  });
  async.parallel(requests, (err, results) => {
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
  var data = 'd ' +  formData;
  var url = 'http://www.lcbo.com/webapp/wcs/stores/servlet/CategoryNavigationResultsView?pageSize=50&manufacturer=&searchType=&resultCatEntryType=&catalogId=10001&categoryId=&langId=-1&storeId=10151&sType=SimpleSearch&filterFacet=&metaData=';

  var args = [method, data, headers, url];
  execFile('curl.exe', args, {}, function (error, stdout, stderr) {
    if (error) {
      console.error('exec error: ' + error);
      return callback(error);
    }
    return callback(null, stdout);
  });
}

var LCBOData = {};

LCBOData.getData = function() {
  var deferred = q.defer();
  
  // Get count
  var form = makeFormData(0);
  request(form, function(error, data) {
    if (error) {
      console.error(error);
      return deferred.reject(error);
    }
    var count = getTotalCount(data);
    console.log('Total: ' + count);

     var requests = [];
    for (var i = 0; i < Math.min(1, count); i += 50) {
      var formData = makeFormData(i);
      requests.push(function(callback) {
        return request(this.formData, callback);
      }.bind({formData: formData}));
    }

    async.parallel(requests, parseResults.bind(null, deferred));
  });

  return deferred.promise;
}

module.exports = LCBOData;