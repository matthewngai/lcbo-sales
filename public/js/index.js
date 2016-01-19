requirejs.config({
  paths: {
    'jquery': 'https://code.jquery.com/jquery-2.2.0',
    'angular': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0-rc.0/angular',
    'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.0.0/lodash',
		'animate': 'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.0-rc.0/angular-animate.min',
		'aria': 'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.0-rc.0/angular-aria.min',
		'messages': 'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.0-rc.0/angular-messages.min',
		'material': 'http://ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min'
  }
});

require(['jquery', 'angular', 'lodash'], function() {
	require(['animate', 'aria', 'messages'], function() {
		require(['app'], function() {
			angular.bootstrap(document, ['app']);
		});
	});
});