app.controller('gameController', ['$scope', '$timeout', '$state', '$stateParams', 'Game', 'Storage', '$ionicGesture',
function($scope, $timeout, $state, $stateParams, Game, Storage, $ionicGesture){

	var self = this;
	var gameboardWrapper = angular.element(document.querySelector("#gameboardWrapper"));

	/**** GAMEPLAY OBJECT ****/
	function GamePlay(){
		this.questionIndex  = 0;
		this.preloader      = document.getElementById("preloader");
		this.timerAnimation = null;
		this.currentScore     = 0;
		this.levelQuestions = [];
		this.level = _.find(Game.levels, 'id', parseInt($stateParams.levelId));
		this.questionTime = this.level.questionTime;
		this.questionTimeRate = 0.9;
		this.levelQuestions = Game.generateLevelQuestions(this.level);

		self.currentLvel = this.level;
		self.currentQuestion = {};
	}

	// START GAME
	GamePlay.prototype.startGame = function(){
		this.playQuestion();
	};

	// PLAY CURRENT QUESTION
	GamePlay.prototype.playQuestion = function(){
		_this = this;
		TweenMax.set(preloader, {width: "0%"});
		this.timerAnimation = TweenMax.to(preloader, this.questionTime, {width: "100%", onComplete:function(){
			_this.gameOver();
			$scope.$digest();
		}});
		self.currentQuestion = this.levelQuestions[this.questionIndex];
		if (Math.random() < 0.5) {
			// SUFFLE ANSWERS
			self.currentQuestion[0] = self.currentQuestion.splice(1, 1, self.currentQuestion[0])[0];
		}
		this.questionTime *= this.questionTimeRate;
	};

	// NEXT QUESTION
	GamePlay.prototype.nextQuestion = function(){
		if (this.questionIndex < this.levelQuestions.length - 1) {
			this.questionIndex++;
			this.playQuestion();
		}else{
			this.gameOver();
		}
	};

	// GAME OVER
	GamePlay.prototype.gameOver = function(){
		TweenMax.set(preloader, {width: "0%"});
		if (this.timerAnimation) {
			this.timerAnimation.kill();
		}
		
		console.log('GAME OVER');
		Game.setEarnedScore(this.level.id, this.currentScore);
		$state.go("menu");
	};

	// SELEC ANSWER
	GamePlay.prototype.selectAnswer = function(index, event){
		TweenMax.set('#block-0' + index, {backgroundColor: 'rgba(255,255,255,0.07)'});
		TweenMax.set('#block-1' + index, {backgroundColor: 'transparent'});

		if (parseInt(self.currentQuestion[index].value) > parseInt(self.currentQuestion[index === 0 ? 1 : 0].value)) {
			this.currentScore ++;
			this.nextQuestion();
			gamePlay.rippleAnimation(event.pageX, event.pageY, 0.5, 50, "#bedb39");
			TweenMax.from('#block-' + index, 0.3, {backgroundColor: '#bedb39', ease: Sine.easeInOut});
		}else{
			this.gameOver();
			gamePlay.rippleAnimation(event.pageX, event.pageY, 0.5, 50, "red");
			TweenMax.from('#block-' + index, 0.3, {backgroundColor: 'red', ease: Sine.easeInOut});
		}
	};

	GamePlay.prototype.rippleAnimation = function(x, y, timing, scale, color){
		var ripple 		  = document.querySelectorAll('.js-ripple'),
			rippleContent = document.getElementById('ripple-content'),
			tl            = new TimelineMax(),
			w             = rippleContent.offsetWidth,
			h             = rippleContent.offsetHeight;

		TweenMax.set(rippleContent, {
			x: x - w / 2,
			y: y - h / 2,
		});

		tl.fromTo(ripple, timing, {
			fill: color,
			x: w / 2,
			y: h / 2,
			transformOrigin: '50% 50%',
			scale: 0,
			opacity: 1,
			ease: Power4.easeOut
		},{
			scale: scale,
			opacity: 0
		});
	};



	/**** GAMEPLAY OBJECT END ****/


	// INIT GAME (TEMPORARY)
	Game.init().then(function(){
		gamePlay = new GamePlay();
		gamePlay.playQuestion();
	}, function(error){
		console.log(error);
	});

	// ANSWER QEUSTION
	$scope.selectOpt = function(index, event){
		gamePlay.selectAnswer(index, event);
	};

}]);














