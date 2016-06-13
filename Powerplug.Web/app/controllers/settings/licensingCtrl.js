/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('LicensingCtrl',
                     ['LicensingResource', LicensingCtrl]);


    function LicensingCtrl(LicensingResource) {
        var vm = this;
                
        //LicensingResource.get(function (data) {
        //    onSuccess(data);
        //}, function (error) {
        //    onError(error);
        //});

        function onError(err) {
            console.log(err);
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function onSuccess(data) {
            vm.licensing = data;
        }
    }
}());