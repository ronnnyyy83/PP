(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('PowerConsumptionResource', ['$resource', 'appSettings', PowerConsumptionResource]);

    function PowerConsumptionResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/power-consumption', null, {
            'saveAll': { method: 'POST'}
        });
    }
}());