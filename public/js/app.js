define(['material', 'dataService', 'products'], function() {
  angular.module('app', ['ngMaterial', 'lsService', 'lsProducts'])
    .controller('AppController', function(lsDataService) {
      var vm = this;
      window.vm = this;

      vm.pageSizes = [10, 20, 50, 100];

      vm.products = [];
      vm.count = 0;
      vm.pageSize = 20;
      vm.pageNumber = 0;
      vm.productView = [];

      
      vm.updateProductView = function() {
        vm.productView = vm.products.slice(vm.pageSize * vm.pageNumber, vm.pageSize * (vm.pageNumber + 1));
      }

      vm.onPageResize = function(page) {
        var maxPageSize = Math.floor(vm.count / vm.pageSize);
        vm.pageNumber = Math.min(page, maxPageSize);

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
        return lsDataService.getSales(offset, limit).then(function(data) {
          vm.count = Number(data.count);
          vm.products = vm.products.concat(data.products);
          vm.updateProductView();
        });
      }

      var initialize = function() {
        vm.updateProducts(vm.pageNumber * vm.pageSize, vm.pageSize)
          .then(function() {
            $('.content').fadeIn();
            $('.splash').fadeOut();

            $('.page-controls').affix({
              offset: {
                top: $('.header').height(),
              }
            });
          });
      }
      initialize();
    })
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('light-green')
        .accentPalette('blue');
    })
    .run(function() {
      
    });
});