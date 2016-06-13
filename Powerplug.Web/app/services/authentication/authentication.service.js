(function () {
    'use strict';

    angular
        .module('powerPlug')
        .factory('AuthenticationService', ['$http', '$cookies', '$rootScope', '$timeout', 'UserService', AuthenticationService]);
        
    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService) {
        var service = {};

        service.Login = Login;
        service.SetToken = SetToken;
        service.ClearToken = ClearToken;

        return service;

        function Login(username, password, callback) {
            UserService.authenticate(username, password).then(function (res) {                
                callback(res);
            });
        }

        function SetToken(token, username) {
            $rootScope.globals = {
                currentUser: {
                    token: token,
                    username : username
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Bearer ' + token; // jshint ignore:line

            var now = new Date();
            var expireDate = new Date(now);
            expireDate.setHours(now.getHours() + 1);
            $cookies.putObject('globals', $rootScope.globals, {'expires' : expireDate});
        }

        function ClearToken() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Bearer';
        }
    }
})();