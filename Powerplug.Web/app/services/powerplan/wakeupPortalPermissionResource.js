(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('WakeupPortalPermissionResource', ['$resource', 'appSettings', WakeupPortalPermissionResource]);

    function WakeupPortalPermissionResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/wakeup-portal/permissions', null, {
            'update': { method: 'PUT' }
        });
    }
}());