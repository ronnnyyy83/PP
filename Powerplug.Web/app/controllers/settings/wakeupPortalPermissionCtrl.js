/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('WakeupPortalPermissionCtrl',
                     ['$state', '$document', '$scope', '$uibModal', 'WakeupPortalPermissionResource',
                         'ComputersResource', 'ComputerGroupsResource', WakeupPortalPermissionCtrl]);


    function WakeupPortalPermissionCtrl($state, $document, $scope, $uibModal, WakeupPortalPermissionResource, ComputersResource, ComputerGroupsResource) {
        var vm = this;

        WakeupPortalPermissionResource.get(function (data) {
            onSuccess(data);
        }, function (error) {
            onError(error);
        });

        function onError(err) {
            console.log(err);
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        vm.generateGuid = function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        function onSuccess(data) {
            for (var i = 0; i < data.permissions.length; i++) {
                data.permissions[i].guid = vm.generateGuid();
            }
            vm.wakeupData = data;
        }

        function initPopups() {
            editWakeupPermissionHandler.init(vm, $uibModal, ComputersResource, ComputerGroupsResource);
            vm.showEditWakeupPermission = editWakeupPermissionHandler.openDialog;
        }

        vm.saveChanges = function () {
            vm.wakeupData.$update(function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        vm.removePermission = function (permissionGuid) {
            angular.forEach(vm.wakeupData.permissions, function (value, key) {
                if (permissionGuid === value.guid) {
                    vm.wakeupData.permissions.splice(key, 1);
                }
            });
        }

        vm.discardChanges = function () {
            WakeupPortalPermissionResource.get(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }
        //===================init============================
        initPopups();
    }
}());