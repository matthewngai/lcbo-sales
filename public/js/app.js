define(['material', 'dataService'], function() {
  angular.module('app', ['ngMaterial', 'lsService'])
    .controller('AppController', function(lsDataService) {
      var vm = this;

      vm.test = '123';
    })
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue');
    });
});