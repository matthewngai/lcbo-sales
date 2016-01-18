var express = require('express');
var router = express.Router();

var LCBOData = require('../modules/LCBOData');

// /api/products?pageNum=Number&pageSize=Number&orderBy=(todo)&filter=(todo)
router.get('/products', function(req, res, next) {
  var pageNum = req.query.pageNum || 0;
  var pageSize = req.query.pageSize || 10;

  var results = LCBOData.get(pageNum, pageSize)
	  .then(products => {
	  	LCBOData.getCount()
	  		.then(count => {
		  		res.set('totalCount', count);
			  	res.send(products);
		  	});
	  }, err => {
	  	res.sendStatus(500);
	  });
});

router.get('/sales', function(req, res, next) {
	LCBOData.getOnSale()
		.then(products => {
			res.send(products);
		}, err => {
			res.sendStatus(500);
		});
});

module.exports = router;