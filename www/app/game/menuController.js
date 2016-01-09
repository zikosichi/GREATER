app.controller('menuController', ['$scope', '$state', '$timeout', 'roundProgressService', 'Game',
function($scope, $state, $timeout, roundProgressService, Game){

	var self = this;

	self.levels = [];
	self.activeLevel = 0;

	// SLIDER OPTIONS
	self.levelsSliderOptionsa = {
		onSlideChangeEnd: function(swiper){
			self.activeLevel = self.levels[swiper.activeIndex];
			$scope.$digest();
		}
	};

	// INIT GAME
	Game.init().then(function(){
		self.levels = Game.levels;
		self.activeLevel = self.levels[Game.initialLevelIndex];

		$scope.$watch('slider', function(swiper) {
			if (swiper) {
				self.swiper = swiper;
				self.swiper.slideTo(Game.initialLevelIndex, 1);
			}
		});

	}, function(error){
		console.log(error);
	});

	self.startGame = function(){
		$state.go('gameboard', {levelId : 1});
	};

}]);