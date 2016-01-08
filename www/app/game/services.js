app.factory('Level', ['$http', '$firebaseArray', '$q', 'Storage',
function($http, $firebaseArray, $q, Storage){

	var fb = new Firebase('https://greatr.firebaseio.com/');

	return {
		allData: null,
		currentLevelScore: 0,
		totalScore: Storage.get('totalScore') || 0,
		currentLevelIndex: Storage.get('currentLevelIndex') || 0,
		loadData: function(){
			var self = this;
			var deferred = $q.defer();
			$http.get('data/greatr-export.json').then(function(response){
				// console.log(response);
				self.allData = response.data;
				deferred.resolve("OK");
			});
			/*fb.once('value', function(snap) {
				self.allData = snap.val();
				deferred.resolve(self.allData);
			});*/
			return deferred.promise;
		},
		generateLevel: function(){
			var self = this;
			var levelQuestions = [];
			level = self.allData.levels[self.currentLevelIndex];

			for (var i = 0; i < level.questionsFrom.length; i++) {
				for (var j = 0; j < self.allData.bank.length; j++) {
					if (level.questionsFrom[i] == self.allData.bank[j].type ) {
						levelQuestions = levelQuestions.concat(self.allData.bank[j].questions);
					}
				}
			}
			return _.shuffle(levelQuestions);
		},
		activateLevel: function(index){
			Storage.put('currentLevelIndex', index);
		},
		saveTotalScore: function(earnedScore){
			Storage.put('totalScore', this.totalScore);

		}
	};

}]);