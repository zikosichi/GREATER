var app = angular.module('greatr', ['ionic', 'firebase', 'angular-svg-round-progress'])

.run(['$ionicPlatform', function($ionicPlatform) {
	$ionicPlatform.ready(function() {


		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

	});
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	$stateProvider
		.state('menu', {
			url: '/menu',
			templateUrl: 'app/game/menu.html',
			controller: 'menuController',
		})
		.state('gameboard', {
			url: '/gameboard',
			templateUrl: 'app/game/gameboard.html',
			controller: 'gameController',
			cache: false
		});

	$urlRouterProvider.otherwise('/menu');

	// $ionicConfigProvider.views.transition('none');


}]);
