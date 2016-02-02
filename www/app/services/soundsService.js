app.factory('Sound', ['$timeout', function($timeout){
	var bg = new Howl({ urls: ['sounds/bg.mp3', 'sounds/bg.wav'], loop: true, volume: 0.3 });
	var startGame = new Howl({ urls: ['sounds/pop_drip_mid.wav']});
	var correctAnswer = new Howl({ urls: ['sounds/pop_drip_mid.wav']});
	var wrongtAnswer = new Howl({ urls: ['sounds/pop_down.wav']});
	var levelComplete = new Howl({ urls: ['sounds/music_glass_lo_no.wav']});
	
	return {
		playBackgroundSound: function(){
			bg.play();			
		},
		click: function(){
			click1.play();
		},
		correctAnswer: function(){
			correctAnswer.play();
		},
		startGame: function(){
			// startGame.play();
			correctAnswer.play();
		},
		wrongtAnswer: function(){
			wrongtAnswer.play();
		},
		levelComplete: function(){
			levelComplete.play();
		}
	};
}]);