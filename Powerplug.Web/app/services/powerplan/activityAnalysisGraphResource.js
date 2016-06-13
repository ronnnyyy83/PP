(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ActivityAnalysisGraphResource', ['$resource', 'appSettings', ActivityAnalysisGraphResource]);

    function ActivityAnalysisGraphResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/dashboard/activity-analysis');
    }
}());