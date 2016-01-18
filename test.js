var execFile = require('child_process').execFile;

var method = '-X POST';
var headers = '-H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded"';
var data = '-d "contentBeginIndex=0&productBeginIndex=50&beginIndex=50&orderBy=&categoryPath=%2F%2F&pageView=&resultType=&orderByContent=&searchTerm=&facet=&storeId=10151&catalogId=10001&langId=-1&fromPage=&objectId=&requesttype=ajax"';
var url = 'http://www.lcbo.com/webapp/wcs/stores/servlet/CategoryNavigationResultsView?pageSize=50&manufacturer=&searchType=&resultCatEntryType=&catalogId=10001&categoryId=&langId=-1&storeId=10151&sType=SimpleSearch&filterFacet=&metaData=';

var args = [method, data, headers, url];

execFile('curl.exe', args, {},
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
