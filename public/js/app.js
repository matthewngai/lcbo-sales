define(['material', 'dataService'], function() {
  angular.module('app', ['ngMaterial', 'lsService'])
    .controller('AppController', function(lsDataService) {
      var vm = this;

      vm.products = [];
      vm.count = 0;
      vm.pageSize = 10;
      vm.pageNumber = 0;
      vm.onPageResize = function(pageSize){
      	var size = pageSize * (vm.pageNumber + 1) - vm.products.length;
      	console.log(vm.pageSize, pageSize);
      	
      }
      vm.updateProducts = function(num, size) {
        // Page Number, Page Size
        lsDataService.getSales(num, size).then(function(data) {
          vm.count = data.count;
          vm.products.concat(data.products);
        });
      }

      vm.getProducts = function() {
        // Page Number, Page Size
        lsDataService.getSales(vm.pageNumber, vm.pageSize).then(function(data) {
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