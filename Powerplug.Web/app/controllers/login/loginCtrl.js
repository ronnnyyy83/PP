(function () {
    'use strict';

    angular
        .module('powerPlug')
        .controller('LoginCtrl', ['$state', 'AuthenticationService', 'FlashService', LoginController]);
        
    function LoginController($state, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearToken();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.authenticated) {
                    AuthenticationService.SetToken(response.token, vm.username);
                    $state.go("dashboard");
                }
                else if (response.status === 401) {
                    FlashService.Error('Wrong Credentials');
                    vm.dataLoading = false;
                }
                else {
                    FlashService.Error('Authorize User Error');
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
