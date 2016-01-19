define(['material', 'dataService'], function() {
  angular.module('app', ['ngMaterial', 'lsService'])
    .controller('AppController', function(lsDataService) {
      var vm = this;

      vm.test = '123';

      // Page Number, Page Size
      lsDataService.getSales(0, 4).then(function(data) {
        console.log(data);
      });
    })
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue');
    });
});