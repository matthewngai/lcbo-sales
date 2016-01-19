define(['material', 'dataService'], function() {
  angular.module('app', ['ngMaterial', 'lsService'])
    .controller('AppController', function(lsDataService) {
      var vm = this;

      vm.products = [];
      vm.count = 0;
      vm.pageSize = 10;
      vm.pageNumber = 0;
      vm.productView = [];
      
      vm.onPageResize = function(){
        var productLength = vm.products.length;
      	var limit = vm.pageSize * (vm.pageNumber + 1) - vm.products.length;
        if (limit > 0) {
          var offset = productLength;
          vm.updateProducts(offset, limit);
        } 
        else {
          vm.updateProductView();
        }
      }

      vm.updateProductView = function() {
        vm.productView = vm.products.slice(vm.pageSize*vm.pageNumber, vm.pageSize*(vm.pageNumber+1));
      }

      vm.updateProducts = function(offset, limit) {
        lsDataService.getSales(offset, limit).then(function(data) {
          vm.count = data.count;
          vm.products = vm.products.concat(data.products);
          vm.updateProductView();
        });
      }
      vm.updateProducts(vm.pageNumber * vm.pageSize, vm.pageSize);
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