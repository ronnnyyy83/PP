(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ComputerGroupsResource', ['$resource', 'appSettings', ComputerGroupsResource]);

    function ComputerGroupsResource($resource, appSettings) {
        return {
            
            groups: $resource(appSettings.serverPath + 'api/pc/computer-groups'),
            groupMembers: $resource(appSettings.serverPath + 'api/pc/computer-groups/:groupId', { groupId: '@groupId' },
                {
                    'saveAll': { method: 'POST', isArray: true }
                }),
        }
    }
}());