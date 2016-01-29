app.controller('menuController', ['$scope', '$state', '$timeout', 'roundProgressService', 'Game', '$rootScope',
function($scope, $state, $timeout, roundProgressService, Game, $rootScope){

	var self = this;

	self.levels = [];
	self.activeLevel = 0;
	self.progressEase = "easeInOutQuart";
	
	// ON ENTER THE MENU FORM
	$scope.$on( "$ionicView.enter", function( scopes, states ) {
		if (states.stateId == "menu") {
			// UPDATE LEVEL SCORE
			var earnedScore = Game.getEarnedScore();
			if (earnedScore) {				
				if (earnedScore.score > 0) {					
					var levelToUpdate = _.find(self.levels, 'id', parseInt(earnedScore.levelId));
					addScoreToLevel(levelToUpdate, earnedScore.score);
				}else{
					Game.clearEarnedScore();
				}
			}
		}
    });

	// INIT GAME
	Game.init().then(initGame, function(error){ console.log(error);});

	function initGame(){
		self.levels = Game.levels;
		self.activeLevel = self.levels[0];
		$rootScope.bgColor = self.activeLevel.color;

		$scope.$watch('slider', function(swiper) {
			if (swiper) {
				// SLIDE TO LAST UNLOCKED LEVEL WHEN SLIDER IS RADY
				var index = _.findLastIndex(self.levels, 'status', 'unlocked'),
					initialLevelIndex = index == -1 ? 0 : index;

				self.swiper = swiper;

				//TIMEOUT IS TEMPORARY - WHILE USING FIREBASE
				$timeout(function(){
					self.swiper.slideTo(initialLevelIndex, 1);					
				}, 100);
			}
		});
	}

	function addScoreToLevel(level, score){
		if ( level.currentScore + score < level.maxScore) {
			// UPDATE LEVEL
			level.currentScore += score;
			$timeout(function(){
				self.progressEase = "easeOutBounce";
				level.currentScore -= score % level.checkpointInterval;
				Game.updateLevelProgress(level);
			}, 800);

			$timeout(function(){
				self.progressEase = "easeInOutQuart";
			}, 1600);
		}else{
			// COMPLETE LEVEL
			completeLevel(level);
		}
	}

	function completeLevel(level){
		level.currentScore = level.maxScore;
		Game.completeLevel(level);
		
		// UNLOCK NEXT LEVEL LEVEL
		var levelIndex = _.findIndex(self.levels, 'id', parseInt(level.id)),
			nextLevel = levelIndex < self.levels.length - 1 ? self.levels[levelIndex + 1] : false;

		if (nextLevel) {
			Game.unlockLevel(nextLevel);
			$timeout(function(){
				self.swiper.slideNext();				
			}, 800);
		}else{
			console.log("GAME FINISHED :)");
		}
	}

	// SWIPER OPTIONS
	$scope.levelsSliderOptionsa = {
		speed: 150,
		onTransitionEnd: function(swiper){
			self.activeLevel = self.levels[swiper.activeIndex];
			$rootScope.bgColor = self.activeLevel.color;
			$scope.$apply();
		}
	};

	self.startGame = function(){
		self.activeLevel = self.levels[self.swiper.activeIndex];
		$state.go('gameboard', {levelId : self.activeLevel.id});
	};

	self.dashLength = function(level){
		return (Math.PI * 200) / (level.maxScore / level.checkpointInterval) - 2;
	};

}]);




