(function () {
    'use strict';
    angular
        .module('common.services', ['ngResource'])
        .constant('appSettings', { serverPath: 'http://localhost:61661/' });
}());


// http://powerplugapi.azurewebsites.net/
// http://localhost:61661/
