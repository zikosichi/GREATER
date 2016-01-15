app.controller('gameController', ['$scope', '$timeout', '$state', '$stateParams', 'Game', 'Storage',
function($scope, $timeout, $state, $stateParams, Game, Storage){

	var self = this;

	/**** GAMEPLAY OBJECT ****/
	function GamePlay(){
		this.questionIndex  = 0;
		this.preloader      = document.getElementById("preloader");
		this.timerAnimation = null;
		this.currentScore     = 0;
		this.levelQuestions = [];
		this.level = _.find(Game.levels, 'id', parseInt($stateParams.levelId));
		this.levelQuestions = Game.generateLevelQuestions(this.level);

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
		this.timerAnimation = TweenMax.to(preloader, 4, {width: "100%", onComplete:function(){
			_this.gameOver();
			$scope.$digest();
		}});
		self.currentQuestion = this.levelQuestions[this.questionIndex];
		if (Math.random() < 0.5) {
			// SUFFLE ANSWERS
			self.currentQuestion[0] = self.currentQuestion.splice(1, 1, self.currentQuestion[0])[0];
		}
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
	GamePlay.prototype.selectAnswer = function(index){
		TweenMax.set('#block-0' + index, {backgroundColor: 'rgba(255,255,255,0.07)'});
		TweenMax.set('#block-1' + index, {backgroundColor: 'transparent'});
		if (self.currentQuestion[index].value > self.currentQuestion[index === 0 ? 1 : 0].value) {
			this.currentScore ++;
			this.nextQuestion();
			TweenMax.from('#block-' + index, 0.3, {backgroundColor: '#bedb39'});
		}else{
			this.gameOver();
			TweenMax.from('#block-' + index, 0.3, {backgroundColor: 'red'});
		}
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
	$scope.selectOpt = function(index){
		gamePlay.selectAnswer(index);
	};

}]);














