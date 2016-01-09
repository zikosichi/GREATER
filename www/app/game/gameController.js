app.controller('gameController', ['$scope', 'Level', '$timeout', '$state', '$stateParams', 'Game',
function($scope, Level, $timeout, $state, $stateParams, Game){

	var self = this;

	/**** GAMEPLAY OBJECT ****/
	function GamePlay(){
		this.questionIndex  = 0;
		this.preloader      = document.getElementById("preloader");
		this.timerAnimation = null;
		this.levelScore     = 0;
		this.levelQuestions = [];

		var l = _.find(Game.levels, 'id', parseInt($stateParams.levelId));
		this.levelQuestions = Game.generateLevelQuestions(l);

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
	};

	// NEXT QUESTION
	GamePlay.prototype.nextQuestion = function(){
		this.questionIndex++;
		this.playQuestion();
	};

	// GAME OVER
	GamePlay.prototype.gameOver = function(){
		TweenMax.set(preloader, {width: "0%"});
		if (this.timerAnimation) {
			this.timerAnimation.kill();
		}
		gamePlay = new GamePlay();
		console.log('GO TO MENU OR ...');
	};

	// SELEC ANSWER
	GamePlay.prototype.selectAnswer = function(index){
		TweenMax.set('#block-' + index, {backgroundColor: 'transparent'});
		if (self.currentQuestion[index].value > self.currentQuestion[index === 0 ? 1 : 0].value) {
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














