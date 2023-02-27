(function(){

	var injectParams = ['$scope', '$state', '$cookies', '$translate', 'notify', 'AuthService'];

	var ApplicationController = function($scope, $state, $cookies, $translate, notify, AuthService) {

		var vm = this;

		$translate('SUCCESSFULLY_LOGGED_OUT').then(function(text) {
			vm.loggedOutText = text;
		});

		vm.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};

		//TODO Why it has to be here to work correctly??? Should be enough to be in authService
		vm.getCurrentUsername = function() {
			return AuthService.currentUsername();
		};

		vm.logout = function() {
			AuthService.logout();

			notify({message: vm.loggedOutText, position: "right", classes: "alert-success"});
			$state.go('home');
		};

		vm.changeLanguage = function (key) {
		    $translate.use(key);
		};

		vm.currentLanguageIsEnglish = function() {
			return $translate.use() === 'en';
		};

		vm.currentLanguageIsGerman = function() {
			return $translate.use() === 'de';
		};

		vm.currentLanguageIsCzech = function() {
			return $translate.use() === 'cz';
		};

	};

	ApplicationController.$inject = injectParams;

	angular.module('openmuc.common').controller('ApplicationController', ApplicationController);

})();
