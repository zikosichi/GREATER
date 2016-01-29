app.factory('Game', ['$http', '$q', 'Storage', '$firebaseObject',
function($http, $q, Storage, $firebaseObject){
	return {
		levels: null,
		questionsBank: null,
		earnedScore: 0,
		_levelsProgress: Storage.get('_levelsProgress') || [],
		init: function(){

			// Storage.clear();

			/*var self = this;
			self._loadData();
			var deferred = $q.defer();
			var ref = new Firebase("https://greatr.firebaseio.com/");
			data = $firebaseObject(ref);

			data.$loaded().then(function(){
				self.levels = data.levels.levels;
				self._updateLevels();
				self.questionsBank = data.bank.types;

				deferred.resolve(data);
			});
			return deferred.promise;*/

			var deferred = $q.defer();
			var self = this;
			self._loadData().then(function(response){

				self.levels = response.data.levels.levels;
				self._updateLevels();
				self.questionsBank = response.data.bank.types;

				deferred.resolve(response);
			}, function(error){
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		generateLevelQuestions: function(level){
			var self = this;
			var levelQuestions = [];
			for (var i = 0; i < level.questionsFrom.length; i++) {
				for (var j = 0; j < self.questionsBank.length; j++) {
					if (level.questionsFrom[i].text == self.questionsBank[j].type ) {
						levelQuestions = levelQuestions.concat(self.questionsBank[j].questions);
					}
				}
			}
			return _.shuffle(levelQuestions);
		},
		unlockLevel: function(level){
			level.status = "unlocked";
			this._updateLevel(level);
		},
		completeLevel: function(level){
			level.currentScore = level.maxScore;
			level.status = "completed";
			this._updateLevel(level);
			this.clearEarnedScore();
		},
		updateLevelProgress: function(level){
			this._updateLevel(level);
			this.clearEarnedScore();
		},
		setEarnedScore: function(levelId, score){
			Storage.put("earnedScore", {
				levelId : levelId,
				score: score
			});
		},
		getEarnedScore: function(){
			return Storage.get("earnedScore");
		},
		clearEarnedScore: function(){
			Storage.remove("earnedScore");
		},
		// UPDATE DATE FROM LOCALSTORAGE
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
			for (var i = 0; i < self._levelsProgress.length; i++) {
				var index = _.findIndex(self.levels, 'id', self._levelsProgress[i].id);

				self.levels[index].checkpointInterval = self._levelsProgress[i].checkpointInterval;
				self.levels[index].currentScore = self._levelsProgress[i].currentScore;
				self.levels[index].maxScore = self._levelsProgress[i].maxScore;
				self.levels[index].status = self._levelsProgress[i].status;

				// angular.extend(self.levels[index], self._levelsProgress[i]);
			}

		}

	};

}]);















