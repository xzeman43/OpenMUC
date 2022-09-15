(function(){

	var injectParams = ['$http', 'SETTINGS', 'AuthService'];

	var AvailableAppsService = function($http, SETTINGS, AuthService) {
    	this.getAll = function() {
			let user = AuthService.currentUsername();

			var req = {
				method: 'GET',
				url: SETTINGS.APPS_URL,
				headers: {
					'username': user
				}
			};
			return $http(req).then(function(response){
					return response.data;
				});
    	}
    };

    AvailableAppsService.$inject = injectParams;

	angular.module('openmuc.common').service('AvailableAppsService', AvailableAppsService);

})();
