app.factory('Storage', ['$http', function($http){

	return {
		get: function(key){
			return JSON.parse(localStorage.getItem(key));
		},
		put: function(key, value){
			localStorage.setItem(key, JSON.stringify(value));
		},
		remove: function(key){
			localStorage.removeItem(key);
		},
		clear: function(key){
			localStorage.clear();
		}

	};

}]);