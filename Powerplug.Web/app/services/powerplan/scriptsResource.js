(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ScriptsResource', ['$resource', 'appSettings', ScriptsResource]);

    function ScriptsResource($resource, appSettings) {
        return {
            basic: $resource(appSettings.serverPath + 'api/pc/scripts', null, {
                'saveAll': { method: 'POST', isArray: true }
            }),
            detailed: $resource(appSettings.serverPath + 'api/pc/scripts/details'),
        }
    }
}());