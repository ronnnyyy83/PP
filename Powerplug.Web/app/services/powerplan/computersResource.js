(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ComputersResource', ['$resource', 'appSettings', ComputersResource]);

    function ComputersResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/computers', { status : 'all' });
    }
}());