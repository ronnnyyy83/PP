(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ConfigurationResource', ['$resource', 'appSettings', ConfigurationResource]);

    function ConfigurationResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/configuration', {}, {
            'update': { method: 'PUT' }
        });
    }
}());