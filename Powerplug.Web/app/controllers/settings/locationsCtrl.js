/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('LocationsCtrl',
                     ['$state', '$document', '$scope', '$uibModal', 'LocationsResource', 'ElectricityPriceResource', LocationsCtrl]);


    function LocationsCtrl($state, $document, $scope, $uibModal, LocationsResource, ElectricityPriceResource) {
        var vm = this;
        /*******************init*********************/
        LocationsResource.query(function (data) {
            onSuccess(data);
        }, function (error) {
            onError(error);
        });
        ElectricityPriceResource.get(function (data) {
            vm.availablePowerRates = data.powerRates;
        }, function (error) {
            onError(error);
        });
        /****************end init**********************/
        function onError(err) {
            console.log(err);
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function onSuccess(data) {
            if (data.constructor === Array) {
                vm.location = data[0];
            } else {
                vm.location = data;
            }
        }

        vm.getTodayRate = function () {
            var startDate, endDate;
            if (vm.location) {
                var todayDate = new Date();
                for (var i = 0; i <= vm.location.powerRates.length - 1 ; i++) {
                    startDate = vm.location.powerRates[i].fromDate;
                    endDate = vm.location.powerRates[i].toDate != undefined ? vm.location.powerRates[i].toDate : todayDate;
                    if ((moment(todayDate).isAfter(moment(startDate).toDate())) &&
                        (moment(todayDate).isBefore(moment(endDate).toDate()) || moment(todayDate).isSame(moment(endDate).toDate()))) {
                        return vm.location.powerRates[i].rateName;
                    }
                }
            }
        }
          
        vm.saveChanges = function () {
            vm.location.$update(function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        vm.discardChanges = function () {
            LocationsResource.query(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }

        vm.showLocationPowerRateDialog = function () {

            var modal = $uibModal.open({
                templateUrl: 'views/settings/dialogs/locationPowerRate.html',
                resolve: {},
                controller: DialogController,
                backdrop: 'static',
                size: 'large'
            });

            modal.result.then(function (locationRatesArr) {
                vm.location.powerRates = locationRatesArr;
            });

            function DialogController($scope, $uibModalInstance) {
                function cloneArray() {
                    var arr = [];
                    vm.location.powerRates.forEach(function (rate) {
                        var copiedRate = {};
                        copiedRate.fromDate    = rate.fromDate;
                        copiedRate.locationId  = rate.locationId;
                        copiedRate.powerRateId = rate.powerRateId;
                        copiedRate.rateName    = rate.rateName;
                        copiedRate.toDate      = rate.toDate;
                        arr.push(copiedRate);
                    });
                    return arr;
                }
                $scope.addLocationPowerRateDialog = function () {
                    var modal = $uibModal.open({
                        templateUrl: 'views/settings/dialogs/addLocationPowerRate.html',
                        resolve: { lastRate: function () { return  $scope.rates[$scope.rates.length - 1] } },
                        controller: DialogController,
                        backdrop: 'static'
                    })
                    modal.rendered.then(function () {
                        //start time  picker
                        $('.power-plug-date-picker').datetimepicker({
                            format: 'MM/DD/YYYY',
                            defaultDate: new Date()
                        });
                    });

                    modal.closed.then(function (data) {
                        //remove date & time picker
                        $('.datetimepicker').datetimepicker('remove');
                    });
                    modal.result.then(function (data) {
                        var newLocationRate = {};
                        //update last rate to-date property
                        $scope.rates[$scope.rates.length - 1].toDate = data.fromDate;
                        //push new loaction rate
                        newLocationRate.locationId = vm.location.locationId;
                        newLocationRate.fromDate = data.fromDate;
                        newLocationRate.powerRateId = data.rate.powerRateId;
                        newLocationRate.rateName = data.rate.rateName;                    
                        $scope.rates.push(newLocationRate);
                    });

                    return modal;

                    function DialogController($scope, $uibModalInstance, $document, lastRate) {
                        $scope.toValidate = false;
                        $scope.lastRate = lastRate;
                        $scope.insertPowerCost = function () {
                            $uibModalInstance.close();
                        };
                        $scope.availableRates = vm.availablePowerRates;
                        $scope.selected = vm.availablePowerRates[0];
                        $scope.add = function () {
                            if ($scope.selected.powerRateId == lastRate.powerRateId) {
                                $scope.toValidate = true;
                                return
                            }
                            $uibModalInstance.close({ rate: $scope.selected, fromDate: moment($('#from-date').val(), 'MM/DD/YYYY')._d });
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }
                }
                $scope.removeRate = function () {
                    $scope.rates.pop();
                    $scope.rates[$scope.rates.length - 1].toDate = null;
                }
                $scope.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                $scope.add = function () {
                    $uibModalInstance.close($scope.rates);
                };
                $scope.formatDate = function (date) {
                    if (date == null){ return '' }
                    return moment(date).format('L');
                }
                $scope.rates = cloneArray();
            }

        }
    }
}());