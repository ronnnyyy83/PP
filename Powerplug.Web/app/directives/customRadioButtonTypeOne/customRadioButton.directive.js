(function () {
    'use strict';

    angular
        .module("powerPlug")
        .directive("customRadioButtonTypeOne", function () {
            return {
                restrict: "E",
                template: "<div><input type='radio' id='{{id}}' name='{{name}}' ng-checked='checked'/><label for={{id}}><span></span><span>{{text}}</span></label></div>",
                scope: {
                    id: "=",
                    name: "=",
                    text: "=",
                    checked: '='
                }
            };
        });
})();
