(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('StatisticsResource', ['$resource', 'appSettings', StatisticsResource]);

    function StatisticsResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/dashboard/statistics');
    }
}());