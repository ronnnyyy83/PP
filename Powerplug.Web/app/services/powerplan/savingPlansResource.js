(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('SavingPlansResource', ['$resource', 'appSettings', SavingPlansResource]);

    function SavingPlansResource($resource, appSettings) {
        return {
            basic: $resource(appSettings.serverPath + 'api/power-plans/:policyId', { policyId: '@policyId' },
                {
                    'update': { method: 'PUT' }
                }),
            priority: $resource(appSettings.serverPath + 'api/power-plans/priority', null,
            {
                'saveAll': {
                    method: 'POST',
                    isArray: true
                }
            })
        }
    }
}());