(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ConsolePermissionResource', ['$resource', 'appSettings', ConsolePermissionResource]);

    function ConsolePermissionResource($resource, appSettings) {
        return {
            roles: $resource(appSettings.serverPath + 'api/pc/permissions/roles'),
            usersAndGrops: $resource(appSettings.serverPath + 'api/pc/permissions', null,
                {
                    'saveAll': { method: 'POST', isArray: true }
                })
        }
    }
}());