var assert = require('assert');
var execFile = require('child_process').execFile;
var cheerio = require('cheerio');

var curlCmd = [
  '-H "Pragma: no-cache"',
  '-H "Origin: http://stage.lcbo.com"',
  '-H "Accept-Encoding: gzip, deflate"',
  '-H "Accept-Language: en-US,en;q=0.8"',
  '-H "User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"',
  '-H "Content-Type: application/x-www-form-urlencoded"',
  '-H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"',
  '-H "Cache-Control: no-cache"',
  '-H "Referer: http://stage.lcbo.com/lcbo-ear/lcbo/lto/searchResults.do"',
  '-H "Connection: keep-alive"',
  '-H "DNT: 1"',
  '-d "productListingType=LTO&language=EN&style=LCBO.css&sort=sortedName&order=1&resultsPerPage=300&page=1&action=result&sortby=sortedName&orderby=&numPerPage=300"',
  'http://stage.lcbo.com/lcbo-ear/lcbo/lto/searchResults.do'
];

function getHtml() {
  return new Promise((resolve, reject) => {
    execFile('curl', curlCmd, {maxBuffer: 512 * 1024}, (error, stdout, stderr) => {
      assert.equal(error, null);
      resolve(stdout);
    });
  });
}

function parseProducts(html) {
  $ = cheerio.load(html);
  var cols = [
    $('.item-details-col0'),
    $('.item-details-col1'),
    $('.item-details-col2')
  ];

  assert.equal(cols[0].length, cols[1].length);
  assert.equal(cols[0].length, cols[2].length);

  var products = [];

  for (var i = 0; i < cols[0].length; i++) {
    var product = [
      $(cols[0][i]),
      $(cols[1][i]),
      $(cols[2][i])
    ];
    var id = /\d+/.exec(product[0].attr('href'))[0];
    var url = '/lcbo/product/a/' + id;

    var imageId = id;
    while (imageId.length < 6) {
      imageId = '0' + imageId;
    }
    var image = '/content/dam/lcbo/products/' + imageId + '.jpg/jcr:content/renditions/cq5dam.thumbnail.319.319.png';

    var infoText = product[2].text();

    var volume = /(\d+) mL/.exec(infoText)[0];
    var was = '$' + /WAS:\s\$\s(\d+\.\d+)/.exec(infoText)[1];
    var now = '$' + /NOW:\s\$\s(\d+\.\d+)/.exec(infoText)[1];
    var save = '$' + /SAVE:\s\$\s(\d+\.\d+)/.exec(infoText)[1];

    var info = {
      id: id,
      name: product[1].text().trim(),
      link: url,
      price: now,
      savedPrice: save,
      volume: volume,
      image: image
    };

    products.push(info);
  }

  return products;
}

function getProducts() {
  return getHtml().then(parseProducts);
}

module.exports = {
  getProducts: getProducts
};
