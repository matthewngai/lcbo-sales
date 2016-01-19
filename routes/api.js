var express = require('express');
var router = express.Router();

var LCBOData = require('../modules/LCBOData');

var getOffset = function(req) {
  return Number(req.query.offset || 0);
}

var getLimit = function(req) {
  return Number(req.query.limit || 10);
}

// /api/products?offset=Number&limit=Number&orderBy=(todo)&filter=(todo)
// router.get('/products', function(req, res, next) {
//   var offset = getOffset(req);
//   var limit = getLimit(req);

//   var results = LCBOData.get(offset, limit)
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

// /api/sales?offset=Number&limit=Number
router.get('/sales', function(req, res, next) {
  var offset = getOffset(req);
  var limit = getLimit(req);

  LCBOData.getOnSale(offset, limit)
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