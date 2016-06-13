/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('PowerConsumptionCtrl',
                     ['$state', '$document', 'PowerConsumptionResource', PowerConsumptionCtrl]);


    function PowerConsumptionCtrl($state, $document, PowerConsumptionResource) {
        var vm = this;

        PowerConsumptionResource.get(function (data) {
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
            vm.powerConsumption = data;
            vm.powerConsumptionFromDB = JSON.parse(JSON.stringify(data));
        }

        vm.ChangeConsumptionByType = function (computerType, consumptionStatus, itemValue) {
            angular.forEach(vm.powerConsumption.models, function (value, key) {
                if (value.assignment === 'ComputerType' && value.computerType === computerType) {
                    value[consumptionStatus] = itemValue;
                    angular.forEach(vm.powerConsumption.computers, function (valueComp, keyComp) {
                        if (valueComp.assignment === 'ComputerModel' && valueComp.modelId === valueComp.modelId) {
                            valueComp[consumptionStatus] = itemValue;
                        }
                    });
                }
            });
        }

        vm.ChangeConsumptionByModel = function (computerModelId, consumptionStatus, itemValue) {
            angular.forEach(vm.powerConsumption.computers, function (value, key) {
                if (value.assignment === 'ComputerModel' && value.modelId === computerModelId) {
                    value[consumptionStatus] = itemValue;
                }
            });
        }  

        vm.ChangeModelAssignment = function (row) {
            if (row.assignment === 'ComputerType') {
                angular.forEach(vm.powerConsumption.default, function (value, key) {
                    if (value.computerType === row.computerType) {
                        row.powerConsumptionHibernate = value.powerConsumptionHibernate;
                        row.powerConsumptionOn = value.powerConsumptionOn;
                        row.powerConsumptionSleep = value.powerConsumptionSleep;
                        row.powerConsumptionWork = value.powerConsumptionWork;
                    }
                });

                angular.forEach(vm.powerConsumption.computers, function (value, key) {
                    if (value.assignment === 'ComputerModel' && value.modelId === row.modelId) {
                        value.powerConsumptionHibernate = row.powerConsumptionHibernate;
                        value.powerConsumptionOn = row.powerConsumptionOn;
                        value.powerConsumptionSleep = row.powerConsumptionSleep;
                        value.powerConsumptionWork = row.powerConsumptionWork;
                    }
                });
            }
        }

        vm.saveChanges = function () {
            var defaultArr = [];
            var modelArr = [];
            var computerArr = [];
            angular.forEach(vm.powerConsumption.default, function (value, key) {
                var itemFromDB = vm.powerConsumptionFromDB.default[key];
                if (value.powerConsumptionHibernate !== itemFromDB.powerConsumptionHibernate || 
                    value.powerConsumptionOn !== itemFromDB.powerConsumptionOn ||
                    value.powerConsumptionWork !== itemFromDB.powerConsumptionWork ||
                    value.powerConsumptionSleep !== itemFromDB.powerConsumptionSleep) {
                    defaultArr.push(value);
                }
            });
            angular.forEach(vm.powerConsumption.models, function (value, key) {
                var itemFromDB = vm.powerConsumptionFromDB.models[key];
                if ((value.assignment !== itemFromDB.assignment) ||
                    (value.assignment === 'ComputerModel' && 
                    (value.powerConsumptionHibernate !== itemFromDB.powerConsumptionHibernate ||
                    value.powerConsumptionOn !== itemFromDB.powerConsumptionOn ||
                    value.powerConsumptionWork !== itemFromDB.powerConsumptionWork ||
                    value.powerConsumptionSleep !== itemFromDB.powerConsumptionSleep))){
                    modelArr.push(value);
                }
            });
            angular.forEach(vm.powerConsumption.computers, function (value, key) {
                var itemFromDB = vm.powerConsumptionFromDB.computers[key];
                if ((value.assignment !== itemFromDB.assignment) ||
                    (value.assignment === 'Computer' &&
                    (value.powerConsumptionHibernate !== itemFromDB.powerConsumptionHibernate ||
                    value.powerConsumptionOn !== itemFromDB.powerConsumptionOn ||
                    value.powerConsumptionWork !== itemFromDB.powerConsumptionWork ||
                    value.powerConsumptionSleep !== itemFromDB.powerConsumptionSleep))) {
                    computerArr.push(value);
                }
            });

            PowerConsumptionResource.saveAll({ 'default': defaultArr, 'models': modelArr, 'computers': computerArr }, function (data) {                
                alert('Successfully Done!');
                onSuccess(data);
            },function (error) {
                onError(error);
            });
        }

        vm.discardChanges = function () {
            PowerConsumptionResource.get(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }
    }
}());