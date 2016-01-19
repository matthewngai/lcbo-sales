define(['material', 'dataService', 'products'], function() {
  angular.module('app', ['ngMaterial', 'lsService', 'lsProducts'])
  .controller('AppController', function(lsDataService) {
    var vm = this;
    window.vm = this;

    vm.pageSizes = [10, 20, 50, 100];

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

    vm.getStart = function() {
      var start = vm.pageNumber * vm.pageSize;
      return Math.min(start + 1, vm.count);
    }

    vm.getEnd = function() {
      var end = (vm.pageNumber + 1) * vm.pageSize;
      return Math.min(end, vm.count);
    }

    vm.updateProductView = function() {
      vm.productView = vm.products.slice(vm.pageSize*vm.pageNumber, vm.pageSize*(vm.pageNumber+1));
    }

    vm.onPageResize = function() {
      var maxPageSize = Math.floor(vm.count / vm.pageSize);
      vm.pageNumber = Math.min(vm.pageNumber, maxPageSize);

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
        vm.count = Number(data.count);
        vm.products = vm.products.concat(data.products);
        vm.updateProductView();
      });
    }
    vm.updateProducts(vm.pageNumber * vm.pageSize, vm.pageSize);
  })
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('light-green')
      .accentPalette('blue');
  });
});