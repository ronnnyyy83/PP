(function () {
    'use strict';

    angular
        .module('common.services')
            .factory('UserService', ['$http', 'appSettings', UserService]);
    
    function UserService($http, appSettings) {
        var service = {};
        service.authenticate = authenticate;

        return service;
                
        function authenticate(username, password) {
            return $http({
                url: appSettings.serverPath + 'api/token',
                method: 'POST',
                data: { 'username' : username , 'password' : password}}).then(handleSuccess, handleError);
        }        

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {            
            return error;            
        }
    }

})();
