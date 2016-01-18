var execFile = require('child_process').execFile;
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

LCBOData.test = function() {
  var method = '-X POST';
  var headers = '-H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"';
  var data = '-d "contentBeginIndex=0&productBeginIndex=50&beginIndex=50&orderBy=&categoryPath=%2F%2F&pageView=&resultType=&orderByContent=&searchTerm=&facet=&storeId=10151&catalogId=10001&langId=-1&fromPage=&objectId=&requesttype=ajax"';
  var url = 'http://www.lcbo.com/webapp/wcs/stores/servlet/CategoryNavigationResultsView?pageSize=50&manufacturer=&searchType=&resultCatEntryType=&catalogId=10001&categoryId=&langId=-1&storeId=10151&sType=SimpleSearch&filterFacet=&metaData=';

  var args = [method, data, headers, url];

  execFile('curl.exe', args, {}, function (error, stdout, stderr) {
    if (error) {
      console.log('exec error: ' + error);
    }
    console.log(stdout);
  });
}

module.exports = LCBOData;