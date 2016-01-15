var app = angular.module('greatr', ['ionic', 'angular-svg-round-progress'])

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
			controller: 'menuController as vm',
		})
		.state('gameboard', {
			url: '/gameboard/:levelId',
			templateUrl: 'app/game/gameboard.html',
			controller: 'gameController as vm',
			cache: false
		});

	$urlRouterProvider.otherwise('/menu');

	// $ionicConfigProvider.views.transition('none');


}]);
