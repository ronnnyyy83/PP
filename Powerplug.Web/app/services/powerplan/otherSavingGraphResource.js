(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('OtherSavingGraphResource', ['$resource', 'appSettings', OtherSavingGraphResource]);

    function OtherSavingGraphResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/dashboard/other-saving');
    }
}());