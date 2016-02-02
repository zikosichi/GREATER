app.controller('menuController', ['$scope', '$state', '$timeout', 'roundProgressService', 'Game', '$rootScope', 'Sound', '$q',
function($scope, $state, $timeout, roundProgressService, Game, $rootScope, Sound, $q){

	var self = this;

	self.levels = [];
	self.activeLevel = 0;
	self.progressEase = "easeInOutQuart";


	// Sound.playBackgroundSound();
	
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

				console.log(initialLevelIndex);

				// ANIMATE LEVEL COMPLETE
				$timeout(function(){
					animateLevelComplete(self.levels[0]);
				}, 1000);


				//TIMEOUT IS TEMPORARY - WHILE USING FIREBASE
				$timeout(function(){
					// self.swiper.slideTo(initialLevelIndex, 1);
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
			randomizeCompliment();
			$timeout(function(){
				animateLevelComplete(level).then(function(){
					self.swiper.slideNext();
				});
			}, 1100);
		}else{
			console.log("GAME FINISHED :)");
		}
	}

	// GENERATE RANDOM COMPLEMENT
	self.compliment = [
		{
			text: "Excellent",
			icon: "images/smiling.svg"
		},
		{
			text: "Great",
			icon: "images/check.svg"
		},
		{
			text: "Super",
			icon: "images/star.svg"
		}
	];
	self.randomCompliment = self.compliment[0];
	function randomizeCompliment(){
		// angular.extend(self.randomCompliment, self.compliment[Math.floor(Math.random() * self.compliment.length)]);
		self.randomCompliment = self.compliment[Math.floor(Math.random() * self.compliment.length)];
		console.log(self.randomCompliment);
	}
	randomizeCompliment();


	// SWIPER OPTIONS
	$scope.levelsSliderOptionsa = {
		speed: 300,
		onTransitionEnd: function(swiper){
			self.activeLevel = self.levels[swiper.activeIndex];
			$rootScope.bgColor = self.activeLevel.color;
			$scope.$apply();
		}
	};

	self.startGame = function(){
		self.activeLevel = self.levels[self.swiper.activeIndex];
		$state.go('gameboard', {levelId : self.activeLevel.id});
		Sound.startGame();
	};

	self.dashLength = function(level){
		return (Math.PI * 200) / (level.maxScore / level.checkpointInterval) - 2;
	};


	// COMPLETE ANIMATNION WITH GREENSOCK (AWSOMEE :)))))
	function animateLevelComplete(level){
		var	tl = new TimelineMax(),
			progressCircle  = document.querySelector("#progress-" + level.id + " svg > circle"),
			progressPath    = document.querySelector("#progress-" + level.id + " svg > path"),
			dashedCircle    = document.querySelector("#progress-" + level.id + " svg g"),
			successText     = document.querySelector("#progress-" + level.id + " .completed-wrapper"),
			texts           = document.querySelector("#progress-" + level.id + " .progress"),
			progressCircleR = progressCircle.getAttribute("r"),
			deferred 		= $q.defer();
		
		tl
		.addLabel('shrink')
		.set(progressCircle, {
			opacity:0},
			'shrink')
		.to(progressPath, 0.8, {
			css:{
				"stroke-width": "35px",
				transformOrigin:"95 95",
				scale: 0.5
			},
			ease: Power4.easeOut},
			'shrink')
		.to(texts, 0.3, {
			opacity: 0 },
			'shrink')
		.to(dashedCircle, 0.8, {
			rotation: "-=250",
			transformOrigin:"50% 50%",
			onComplete: function(){
				Sound.levelComplete();
			},
			ease: Power4.easeOut},
			'shrink')

		.addLabel('expand')
		.to(progressCircle, 0.1, {
			attr:{ r: progressCircleR },
			opacity: 0,
			},
			'expand')
		.to(progressPath, 1, {
			css:{
				"stroke-width": "17px",
				transformOrigin:"95 95",
				scale: 1
			},
			delay: 0.1,
			ease: Elastic.easeOut.config(1, 0.4) },
			'expand')
		.to(dashedCircle, 0.3, {
			rotation: "+=250",
			transformOrigin:"50% 50%",
			opacity: 0,
			ease: Power4.easeOut },
			'expand')
		.fromTo(successText, 0.8, {
			delay:0.15,
			transformOrigin:"50% 50%",
			scale: 0.3
		},
		{
			scale: 1,
			opacity: 1,
			ease: Power4.easeOut,
			onComplete: function(){
				deferred.resolve('Finished');
			}
			},
			'expand')

		.addLabel('restore')
		.to(successText, 0.3,{
			opacity: 0,
			top: "+=10",
			delay: 2,
			ease: Power4.easeOut },
			'restore')
		.fromTo(texts, 1,{
			opacity: 0,
			top: "-=15"
			},{
			delay: 2,
			opacity: 1,
			top: "+=15",
			ease: Power4.easeOut },
			'restore')
		;

		return deferred.promise;
	}

}]);




