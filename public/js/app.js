define(['material', 'dataService'], function() {
  angular.module('app', ['ngMaterial', 'lsService'])
    .controller('AppController', function(lsDataService) {
      var vm = this;

      vm.products = [];
      vm.count = 0;

      vm.getProducts = function() {
        // Page Number, Page Size
        lsDataService.getSales(0, 4).then(function(data) {
          vm.count = data.count;
          vm.products = data.products;
        });
      }
      vm.getProducts();
    })
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue');
    });
});