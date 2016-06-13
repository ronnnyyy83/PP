(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('PowerConsumptionGraphResource', ['$resource', 'appSettings', PowerConsumptionGraphResource]);

    function PowerConsumptionGraphResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/dashboard/power-consumption');
    }
}());