define(['material', 'dataService', 'products'], function() {
  angular.module('app', ['ngMaterial', 'lsService', 'lsProducts'])
  .controller('AppController', function(lsDataService) {
    var vm = this;

    vm.products = [];
    vm.count = 0;
    vm.pageSize = 10;
    vm.pageNumber = 0;
    vm.productView = [];
    
    vm.hasPrevious = function() {
      return vm.pageNumber > 0;
    }

    vm.hasNext = function() {
      return vm.count > (vm.pageNumber + 1) * vm.pageSize;
    }

    vm.previousPage = function() {
      if (vm.hasPrevious()) {
        vm.pageNumber--;
        vm.onPageResize();
      }
    }

    vm.nextPage = function() {
      if (vm.hasNext()) {
        vm.pageNumber++;
        vm.onPageResize();
      }
    }

    vm.updateProductView = function() {
      vm.productView = vm.products.slice(vm.pageSize*vm.pageNumber, vm.pageSize*(vm.pageNumber+1));
    }

    vm.onPageResize = function() {
      var productLength = vm.products.length;
      var limit = vm.pageSize * (vm.pageNumber + 1) - vm.products.length;
      if (limit > 0) {
        var offset = productLength;
        vm.updateProducts(offset, limit);
      } else {
        vm.updateProductView();
      }
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
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('blue');
  });
});