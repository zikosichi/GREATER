app.controller('gameController', ['$scope', 'Level', '$timeout', '$state',
function($scope, Level, $timeout, $state){
	
	Level.loadData().then(function(){
		levelQuestions = Level.generateLevel("level1");
		initGame();
	});

	//Setting variables
	$scope.currentQuestion = {};
	var levelQuestions = [],
		i = 0,
		preloader = document.getElementById("preloader"),
		timerAnimation = null,
		levelScore = 0;
	
	//Initialize game
	function initGame(){
		playQuestion();
	}

	//Play current question preloader
	function playQuestion(){

		TweenMax.set(preloader, {width: "0%"});
		timerAnimation = TweenMax.to(preloader, 5, {width: "100%", onComplete:gameOver});

		$scope.currentQuestion = levelQuestions[i];
	}

	//Go to next question
	function nextQuestion(){
		i++;
		playQuestion();
	}

	//Game over
	function gameOver(){
		TweenMax.set(preloader, {width: "0%"});
		timerAnimation.kill();
		$state.go('menu');
		Level.currentLevelScore = levelScore;
	}

	//Answer qeustion
	$scope.selectOpt = function(clicked, notclicked, blockId){

		if (clicked > notclicked) {
			TweenMax.from('#' + blockId, 0.3, {backgroundColor: '#bedb39'});
			nextQuestion();
			levelScore ++;
		}else{
			TweenMax.from('#' + blockId, 0.3, {backgroundColor: '#da4d4d'});
			gameOver();
		}
	};


}]);














