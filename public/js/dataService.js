define(['constants', function() {
	angular.module('lsService', ['lsConstants'])
		.factory('lsDataService', function(lsConstants) {
			var ds = {};

			ds.cache = [];

			ds.getSales = function() {

			}

			return ds;
		});
});