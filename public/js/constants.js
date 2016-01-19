define(function() {
	angular.module('lsConstants', [])
		.factory('lsConstants', function() {
			var constants = {
				'LCBO_URL': 'http://www.lcbo.com'.
				'API_URL': '/api',
				'SALES_URL': '/api/sales'
			}; 

			return constants;
		})
});