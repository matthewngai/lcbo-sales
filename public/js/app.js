define(['material', 'dataService'], function() {
  angular.module('app', ['ngMaterial', 'lsService'])
    .controller('AppController', function(lsDataService) {
      var vm = this;

      vm.test = '123';

      this.abc = function(){
	      // Page Number, Page Size
	      return lsDataService.getSales(0, 4).then(function(data) {
	        console.log(data);
	        return data.count;
	      });
      };
    })
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue');
    });
});