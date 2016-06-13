(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ElectricityPriceResource', ['$resource', 'appSettings', ElectricityPriceResource]);

    function ElectricityPriceResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/power-rates');
    }
}());