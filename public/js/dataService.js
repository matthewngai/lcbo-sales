define(['constants', function() {
	angular.module('lsService', ['lsConstants'])
		.factory('lsDataService', function($http, lsConstants) {
			var ds = {};

			ds.cache = [];

			ds.getSales = function() {

			}

			return ds;
		});
});