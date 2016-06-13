(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('DevicesResource', ['$resource', 'appSettings', DevicesResource]);

    function DevicesResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/dashboard/devices');
    }
}());