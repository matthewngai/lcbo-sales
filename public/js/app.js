define(['material'], function() {
	angular.module('app', ['ngMaterial'])
		.controller('AppController', function() {
			var vm = this;

			vm.test = '123';
		});
});