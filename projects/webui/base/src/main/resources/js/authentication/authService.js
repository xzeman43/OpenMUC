(function () {

    var injectParams = ['$rootScope', '$http', '$state', '$cookies', 'SETTINGS'];

    var AuthService = function ($rootScope, $http, $state, $cookies, SETTINGS) {
        var userName;
        var auth;

        this.login = function (credentials) {
            var req = {
                method: 'POST',
                url: SETTINGS.LOGIN_URL,
                data: angular.element.param({user: credentials.user, pwd: credentials.pwd}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            userName = credentials.user;
            var p = $http(req);
            p.then(r => {
                auth = 'Basic ' + btoa(credentials.user + ":" + credentials.pwd);
                $cookies.put('authentication', auth);
            });
            return p;
        };

        this.currentUsername = function() {
            if (typeof userName == 'undefined'){
                if (!this.isLoggedIn()){
                    console.log(userName);
                    return "";
                }
            }
            return userName;
        };

        this.getRestAuth = function() {
            auth = $cookies.get("authentication");
            return auth;
        };

        this.redirectToLogin = function () {
            $state.go('home');
        };

        this.isLoggedIn = function () {
            auth = $cookies.get("authentication")
            if (auth !== null && auth !== undefined) {
                var login = atob(auth.slice(6))
                var split = login.split(":")
                userName = split[0]
            }
            return auth != null;
        };

        this.logout = function () {
            $cookies.remove("authentication");
        };

    };

    AuthService.$inject = injectParams;

    angular.module('openmuc.auth').service('AuthService', AuthService);

})();
