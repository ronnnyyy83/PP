/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('WakeOnLanCtrl',
                     ['$state', '$document', '$uibModal', '$scope', 'WolConfigResource', 'ComputersResource', 'ComputerGroupsResource',
                         WakeOnLanCtrl]);


    function WakeOnLanCtrl($state, $document, $uibModal, $scope, WolConfigResource, ComputersResource, ComputerGroupsResource) {
        var vm = this;

        computersNameDialodHandler.init($uibModal, ComputersResource, ComputerGroupsResource);

        WolConfigResource.get(function (data) {
            vm.wakeOnLan = data;
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
        function onSuccess(data) {
        }


        vm.removeComputer = function (index) {
            vm.wakeOnLan.wolRelayComputers.splice(index, 1);
        }
        vm.openComputerDialog = function () {
            var modal = computersNameDialodHandler.addComputerDialog(vm.wakeOnLan.wolRelayComputers, false);
            modal.result.then(function () {
            });
        }

        vm.discardChanges = function () {

            WolConfigResource.get(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }
        vm.saveChanges = function () {
            vm.wakeOnLan.$update(function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }
    }
}());