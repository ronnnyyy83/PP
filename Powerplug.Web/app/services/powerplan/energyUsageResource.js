(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('EnergyUsageResource', ['$resource', 'appSettings', EnergyUsageResource]);

    function EnergyUsageResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/dashboard/energy-usage');
    }
}());