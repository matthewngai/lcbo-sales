var express = require('express');
var router = express.Router();

var LCBOData = require('../modules/LCBOData');

var getPageNum = function(req) {
  return Number(req.query.pageNum || 0);
}

var getPageSize = function(req) {
  return Number(req.query.pageSize || 10);
}

// /api/products?pageNum=Number&pageSize=Number&orderBy=(todo)&filter=(todo)
// router.get('/products', function(req, res, next) {
//   var pageNum = getPageNum(req);
//   var pageSize = getPageSize(req);

//   var results = LCBOData.get(pageNum, pageSize)
//     .then(products => {
//       LCBOData.getCount()
//         .then(count => {
//           res.set('totalCount', count);
//           res.send(products);
//         });
//     }, err => {
//       res.sendStatus(500);
//     });
// });

// /api/sales?pageNum=Number&pageSize=Number
router.get('/sales', function(req, res, next) {
  var pageNum = getPageNum(req);
  var pageSize = getPageSize(req);

  LCBOData.getOnSale(pageNum, pageSize)
    .then(products => {
      LCBOData.getSaleCount()
        .then(count => {
          res.set('totalCount', count);
          res.send(products);
        });
    }, err => {
      res.sendStatus(500);
    });
});

module.exports = router;