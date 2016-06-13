(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('LicensingResource', ['$resource', 'appSettings', LicensingResource]);

    function LicensingResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/scripts');
    }
}());