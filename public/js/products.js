define(['constants'], function() {
	angular.module('lsProducts', ['lsConstants'])
		.directive('lsProductTable', function(lsConstants) {
	    return {
	      restrict: 'E',
	      scope: {
	        products: '=lsProducts'
	      },
	      controller: function(lsConstants) {
	        var vm = this;
	        vm.getLink = function(link) {
	          return lsConstants.LCBO_URL + link;
	        }
	      },
	      bindToController: true,
	      controllerAs: 'vm',
	      templateUrl: 'templates/product-table.html'
	    };
	  });
});