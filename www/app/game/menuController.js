app.controller('menuController', ['$scope', '$state', '$timeout', 'roundProgressService', 'Game',
function($scope, $state, $timeout, roundProgressService, Game){


	$scope.levels = [];
	$scope.activeLevel = 0;

	// SLIDER OPTIONS
	$scope.levelsSliderOptionsa = {
		initialSlide: $scope.activeLevel,
		onSlideChangeEnd: function(swiper){
			$scope.activeLevel = $scope.levels[swiper.activeIndex];
		}
	};


	$scope.$watch('slider', function(swiper) {
		if (swiper) {
			swiper.slideTo(Game.initialLevelIndex, 0);
		}
	});

	// INIT GAME
	Game.init().then(function(){
		$scope.levels = Game.levels;
		$scope.activeLevel = Game.initialLevelIndex;

	}, function(error){
		console.log(error);
	});


	$scope.getStyle = function(){
		var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

		return {
			'top': $scope.isSemi ? 'auto' : '55%',
			'bottom': $scope.isSemi ? '5%' : 'auto',
			'left': '50%',
			'transform': transform,
			'-moz-transform': transform,
			'-webkit-transform': transform,
			'font-size': $scope.radius/3.5 + 'px'
		};
	};

	$scope.startGame = function(){
		console.log($scope.activeLevel);
	};

	/*// LOAD ALL DATA
	Level.loadData().then(function(){
		$scope.currentLevel = Level.allData.levels[Level.currentLevelIndex];
		$scope.updateLevelProgress(0);
	});

	// UPDATE LEVEL SCORE ON VIEW ENTER
	$scope.levelProgress = 0;
	$scope.$on( "$ionicView.enter", function( scopes, states ) {
		if (Level.currentLevelScore !== 0) {
			$scope.updateLevelProgress(Level.currentLevelScore);
			Level.currentLevelScore = 0;
		}
	});


	// LEVEL PROGRESS UPDATE FUNCTION
	$scope.updateLevelProgress = function(earnedScore){
		Level.totalScore += earnedScore;
		var totalScore = Level.totalScore;
		if (totalScore !== 0) {
			$scope.levelProgress =
				(totalScore - $scope.currentLevel.scoreRange[0]) / 
				($scope.currentLevel.scoreRange[1] - $scope.currentLevel.scoreRange[0]);
			Level.saveTotalScore();
		}else{
			$scope.levelProgress = 0;
		}
	};

	

	// START NEW GAME
	$scope.startGame = function(){
		$state.go('gameboard');
	};*/

}]);