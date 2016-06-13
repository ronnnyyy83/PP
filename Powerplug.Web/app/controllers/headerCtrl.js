(function(){
  'use strict';

  angular
    .module('powerPlug')
    .controller('HeaderController', ['$state', '$rootScope', '$cookies', function ($state, $rootScope, $cookies) {
        var vm = this;
        vm.state = $state;

        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            vm.username = $rootScope.globals.currentUser.username;
        }
    }])
})();
