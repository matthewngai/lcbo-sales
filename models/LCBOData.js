var request = require('request');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

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

var LCBOData = {};

LCBOData.test2 = function() {
  request.post({
   url: url,
   qs: form,
   headers: {
     'cache-control': 'no-cache'
   }
  }, function(err, response, body) {
   if (err) {
     console.error(err);
     return;
   }
   console.log(body);
  });
}

// var request = require("request");

LCBOData.test = function() {
  var http = require("http");

  var options = {
    "method": "POST",
    "hostname": "www.lcbo.com",
    "port": null,
    "path": "/webapp/wcs/stores/servlet/CategoryNavigationResultsView?pageSize=50&manufacturer=&searchType=&resultCatEntryType=&catalogId=10001&categoryId=&langId=-1&storeId=10151&sType=SimpleSearch&filterFacet=&metaData=",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "5f029b66-c3f7-e8e2-1305-ca38394b57dc"
    }
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.end();
}

module.exports = LCBOData;