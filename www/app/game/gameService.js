app.factory('Game', ['$http', '$firebaseArray', '$q', 'Storage',
function($http, $firebaseArray, $q, Storage){

	return {
		levels: null,
		questionsBank: null,
		initialLevelIndex: 0,
		_levelsProgress: Storage.get('_levelsProgress') || [],
		init: function(){
			var deferred = $q.defer();
			var self = this;
			self._loadData().then(function(response){
				self.levels = response.data.levels;
				self._updateLevels();
				self.questionsBank = response.data.bank;

				// Find initial level
				var index = _.findLastIndex(self.levels, 'unlocked', true);
				self.initialLevelIndex = index == -1 ? 0 : index;
				deferred.resolve(response);
			}, function(error){
				console.log(error);
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		generateLevelQuestions: function(level){
			var self = this;
			var levelQuestions = [];
			for (var i = 0; i < level.questionsFrom.length; i++) {
				for (var j = 0; j < self.questionsBank.length; j++) {
					if (level.questionsFrom[i] == self.questionsBank[j].type ) {
						levelQuestions = levelQuestions.concat(self.questionsBank[j].questions);
					}
				}
			}
			return _.shuffle(levelQuestions);
		},
		unlockLevel: function(level){
			level.currentScore = level.maxScore;
			level.unlocked = true;
			this._updateLevel(level);
		},
		updateLevelProgress: function(level){
			this._updateLevel(level);
		},
		//Update date from localstorage
		_updateLevel: function(level){
			var self = this;
			index = _.findIndex(self._levelsProgress, 'id', level.id);
			if (index == -1) {
				self._levelsProgress.push(level);
			}else{
				self._levelsProgress[index] = level;
			}
			self._saveLevelsProgress();
		},
		_saveLevelsProgress: function(){
			Storage.put('_levelsProgress', this._levelsProgress);
			this._updateLevels();
		},
		_loadData: function(){
			return $http.get('data/greatr-data.json');
		},
		_updateLevels: function(){
			self = this;
			var index;
			for (var i = 0; i < self._levelsProgress.length; i++) {
				index = _.findIndex(self.levels, 'id', self._levelsProgress[i].id);
				self.levels[index].currentScore = self._levelsProgress[i].currentScore;
				self.levels[index].unlocked     = self._levelsProgress[i].unlocked;
			}

		}

	};

}]);















