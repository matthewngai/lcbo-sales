define(['material', 'dataService'], function() {
  angular.module('app', ['ngMaterial', 'lsService'])
    .controller('AppController', function(lsDataService) {
      var vm = this;

      vm.products = [];
      vm.count = 0;
      vm.getProducts = function() {
        // Page Number, Page Size
        lsDataService.getSales(0, 165).then(function(data) {
          vm.count = data.count;
          vm.products = data.products;
        });
      }
      vm.getProducts();
    })
    .directive('lsTable',function(){
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
    		templateUrl: 'templates/table.html'
    	};
    })
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue');
    });
});