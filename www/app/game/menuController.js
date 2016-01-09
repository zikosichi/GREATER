app.controller('menuController', ['$scope', '$state', '$timeout', 'roundProgressService', 'Game',
function($scope, $state, $timeout, roundProgressService, Game){

	$scope.levels = [];
	$scope.activeLevel = 0;

	// SLIDER OPTIONS
	$scope.levelsSliderOptionsa = {
		/*paginationBulletRender: function (index, className) {
			return '<small class="' + className + '">' + (index + 1) + '</small>';
		},*/
		onSlideChangeEnd: function(swiper){
			$scope.activeLevel = $scope.levels[swiper.activeIndex];
			$scope.$digest();
		}
	};

	// INIT GAME
	Game.init().then(function(){
		$scope.levels = Game.levels;
		$scope.activeLevel = $scope.levels[Game.initialLevelIndex];

		console.log($scope.levels);

		$scope.$watch('slider', function(swiper) {
			if (swiper) {
				$scope.swiper = swiper;
				$scope.swiper.slideTo(Game.initialLevelIndex, 1);
			}
		});

	}, function(error){
		console.log(error);
	});
$scope.test = 0;
	$scope.startGame = function(){
		$scope.test ++;
		console.log($scope.activeLevel);
	};

}]);