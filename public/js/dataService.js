define(['constants'], function() {
	angular.module('lsService', ['lsConstants'])
		.factory('lsDataService', function($http, lsConstants) {
			var ds = {};

			// Returns { products, count }
			ds.getSales = function(offset, limit) {
				var options = ['offset=' + offset, 'limit=' + limit].join('&');
				return $http.get(lsConstants.SALES_URL + '?' + options)
					.then(function(response) {
						return {
							products: response.data,
							count: response.headers('totalCount')
						};
					});
			}

			return ds;
		});
});