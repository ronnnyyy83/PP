(function () {
    'use strict';
    angular
        .module('powerPlug').directive('conditionsTab', function () {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/conditions.html',
                scope: {
                    jsonobject: '=',
                },
                link: function (scope, element, attrs) {
                    if (typeof (scope.jsonobject) != 'undefined') {
                        scope.hoursLastBoot = scope.jsonobject.hoursLastBoot;
                        scope.idleTime      = scope.jsonobject.idleTime
                    }
                    scope.$on('saveSettings', function (event, data) {
                        scope.jsonobject.hoursLastBoot = scope.hoursLastBoot;
                        scope.jsonobject.idleTime = scope.idleTime;
                    });
                    scope.getHoursLastBootValue = function () {
                        if (scope.hoursLastBoot < 0) {
                            scope.hoursLastBoot = 0
                        }
                        else if (scope.hoursLastBoot > 31) {
                            scope.hoursLastBoot = 31;
                        }
                    }

                }
            }
        })
}());