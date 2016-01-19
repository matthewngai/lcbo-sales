define(['constants'], function() {
	angular.module('lsService', ['lsConstants'])
		.factory('lsDataService', function($http, lsConstants) {
			var ds = {};

			// Returns { products, count }
			ds.getSales = function(pageNum, pageSize) {
				var options = ['pageNum=' + pageNum, 'pageSize=' + pageSize].join('&');
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