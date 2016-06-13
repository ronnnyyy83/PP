(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('WolConfigResource', ['$resource', 'appSettings', WolConfigResource]);

    function WolConfigResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/configuration/wol', {}, {
            'update': { method: 'PUT' }
        });
    }
}());