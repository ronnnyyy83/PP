(function () {
    'use strict';

    angular
       .module('powerPlug')
       .directive('validNumber', function () {
           return {
               require: '?ngModel',
               link: function (scope, element, attrs, ngModelCtrl) {
                   if (!ngModelCtrl) {
                       return;
                   }

                   ngModelCtrl.$parsers.push(function (val) {
                       if (angular.isUndefined(val)) {
                           var val = '';
                       }
                       var clean = val.replace(/[^(\d+\.\d+)]/g, '');
                       if (val !== clean) {
                           ngModelCtrl.$setViewValue(clean);
                           ngModelCtrl.$render();
                       }
                       return clean;
                   });

                   element.bind('keypress', function (event) {
                       if (event.keyCode === 32) {
                           event.preventDefault();
                       }
                   });
               }
           };
       })
        .directive('naturalNumber', ['$filter',
            function ($filter) {
                return {
                    require: 'ngModel',
                    link: function (scope, elm, attrs, ctrl) {
                        ctrl.$parsers.unshift(function (val) {
                            if (angular.isUndefined(val) || !val) {
                                var val = '0';
                            }
                            val = val.toString()
                            var clean = val.replace(/[^(\d)]/g, '');
                            ctrl.$setViewValue(clean);
                            ctrl.$render();
                            return parseInt(clean);
                        });
                        elm.bind('keypress', function (event) {
                            if (event.keyCode === 32 || event.keyCode === 190 || event.keyCode === 46) {
                                event.preventDefault();
                            }
                        });
                    }
                };
            }
        ]);
})();
