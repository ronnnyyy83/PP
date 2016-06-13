/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('SavingPlansCtrl',
                     ['$state', '$uibModal', 'SavingPlansResource', SavingPlansCtrl]);


    function SavingPlansCtrl($state, $uibModal, SavingPlansResource) {
        var vm = this;        

        SavingPlansResource.basic.query(function (data) {
            vm.savingPlans = data;
            vm.sortListOrder();
            managePPListHandler.init(vm, $uibModal, SavingPlansResource);
        }, function (error) {
            if (error.status === 401 || error.status === -1)
            {
                $state.go('login');
            }
        });

        vm.sort = {
            column: '',
            descending: false
        };

        vm.changeSorting = function (column) {
            var sort = vm.sort;

            if (sort.column == column) {
                sort.descending = !sort.descending;
            } else {
                sort.column = column;
                sort.descending = false;
            }
        };

        vm.sortListOrder = function () {
            vm.savingPlans.sort(function (a, b) { return b.listOrder - a.listOrder });

            for (var a = 0; a < vm.savingPlans.length; a++) {
                vm.savingPlans[a].orderNo = a + 1;
            }
        }

        //init  manage power plan list handler
        vm.openManageDialog = managePPListHandler.openManageDialog;
    }
}());
