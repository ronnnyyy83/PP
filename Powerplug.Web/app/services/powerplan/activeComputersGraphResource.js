(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ActiveComputersGraphResource', ['$resource', 'appSettings', ActiveComputersGraphResource]);

    function ActiveComputersGraphResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/dashboard/active-computers');
    }
}());