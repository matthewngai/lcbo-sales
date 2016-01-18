var mongoose = require('mongoose');

var Database = {
	db: null
};

Database.connect = function(url, callback) {
	mongoose.connect(url);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Database connection error.'));
	db.once('open', function() {
		console.log('Database connection successful.');
		callback();
	});
	this.db = db;
};

Database.get = function() {
	return this.db;
};

module.exports = Database;