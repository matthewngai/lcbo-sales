var express = require('express');
var router = express.Router();

var LCBOParser = require('../modules/LCBOParser');
LCBOParser.update().then(function() {
	console.log('Update complete.');
});

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;