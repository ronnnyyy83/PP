(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('PowerPlansResource', ['$resource', 'appSettings', PowerPlansResource]);

    function PowerPlansResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/dashboard/power-plans');
    }
}());