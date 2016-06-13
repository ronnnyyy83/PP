/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ElectricityPriceCtrl',
                     ['$state', '$document', '$scope', '$uibModal', 'ElectricityPriceResource', ElectricityPriceCtrl]);


    function ElectricityPriceCtrl($state, $document, $scope, $uibModal, ElectricityPriceResource) {
        var vm = this;
        var deletedRates = [];
        ElectricityPriceResource.get(function (data) {
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
            vm.powerRates = data.powerRates;
            vm.currencySymbol = data.currencySymbol;
            vm.installationDT = data.installationDT;
            vm.countryId = data.countryId;
        }

        vm.removePowerRate = function (index) {
            var deletedRateObj = {};
            if (vm.powerRates[index].status !== 'added') {
                deletedRateObj = {
                    powerRateId: vm.powerRates[index].powerRateId,
                    rateName: vm.powerRates[index].rateName
                };
                deletedRates.push(deletedRateObj);
                vm.powerRates.splice(index, 1)
            } else {
                vm.powerRates.splice(index, 1)
            }
        }
        vm.saveChanges = function () {
            var returnObj = {};
            var updatedRates = [];
            var createdRates = [];
            vm.powerRates.forEach(function (rate, index) {
                if (rate.status === 'added') {
                    createdRates.push(rate)
                } else if (rate.status === 'updated') {
                    updatedRates.push(rate)
                }
            })
            returnObj.currCountryId = vm.countryId
            returnObj.create = createdRates;
            returnObj.update = updatedRates;
            returnObj.delete = deletedRates;
            ElectricityPriceResource.save(returnObj, function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        vm.discardChanges = function () {
            ElectricityPriceResource.get(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }

        vm.getPrice = function (rate) {
            var priceItems, startDate, endDate;
            var today = moment(new Date);
            var cost = rate.powerCost.length > 0 ? rate.powerCost[rate.powerCost.length - 1].costPerKWH : 0;
            for (var i = 0; i < rate.powerCost.length - 1; i++) {
                priceItems = rate.powerCost[i];
                startDate = moment(priceItems.fromDate);
                if (priceItems.toDate) {
                    endDate = moment(priceItems.toDate);
                    if (today.isBetween(startDate, endDate)) {
                        cost = priceItems.costPerKWH;
                        break;
                    }
                } else {
                    cost = priceItems.costPerKWH;
                    break;
                }
            }
            return cost + vm.currencySymbol
        }
        vm.showPowerRateDialog = function (powerRateId, ev) {
            $uibModal.open({
                templateUrl: 'views/settings/dialogs/powerRate.html',
                resolve: {
                    params: function () {
                        return {
                            powerRateId: powerRateId,
                            powerRates: vm.powerRates,
                            currencySymbol: vm.currencySymbol,
                            installationDT: vm.installationDT,
                            countryId: vm.countryId
                        }
                    }
                },
                controller: firstDialogController,
                backdrop: 'static',
                size: 'large'
            });

            function firstDialogController($scope, $uibModalInstance, params) {
                /*======================private==============================*/
                var rateIndex = -1;
                var copyRateToScope = function (rate) {
                    $scope.rate.powerRateId = rate.powerRateId;
                    $scope.rate.rateName = rate.rateName;
                    $scope.rate.rateTypeId = rate.rateTypeId;
                    $scope.rate.powerCompany = rate.powerCompany;
                    $scope.rate.powerCost = rate.powerCost.slice();
                }
                var init = function () {
                    if (params.powerRateId != 0) {
                        //find rate;
                        params.powerRates.forEach(function (rateItem, index) {
                            if (rateItem.powerRateId == params.powerRateId) {
                                rateIndex = index;
                                copyRateToScope(rateItem);
                            }
                        })
                    }
                    $scope.currencySymbol = params.currencySymbol;
                }

                var validate = function () {
                    $scope.errorMsg.show = false;
                    if ($scope.toValidate) {
                        if ($scope.powerRateForm.rateName.$error.required) {
                            return showError("Please enter Power Rate name");
                        }
                        if ($scope.rate.powerCost.length == 0) {
                            return showError("Please enter Power Cost for the Power Rate");
                        }
                    }
                    return true
                }
                var showError = function (msgText) {
                    $('.modal-body').scrollTop(0);
                    $scope.errorMsg = { text: msgText, show: true }
                    return false;
                }
                var updateRate = function () {
                    var newRate = {};
                    if (rateIndex >= 0) {
                        params.powerRates[rateIndex].rateName = $scope.rate.rateName
                        params.powerRates[rateIndex].powerCompany = $scope.rate.powerCompany
                        params.powerRates[rateIndex].powerCost = $scope.rate.powerCost.slice();
                        params.powerRates[rateIndex].status = params.powerRates[rateIndex].status ? params.powerRates[rateIndex].status : "updated"
                    } else {
                        newRate.rateName = $scope.rate.rateName
                        newRate.powerCompany = $scope.rate.powerCompany
                        newRate.rateTypeId = 1
                        newRate.powerCost = $scope.rate.powerCost.slice();
                        newRate.status = "added";
                        newRate.countryId = params.countryId
                        params.powerRates.push(newRate)
                    }
                }
                /*=========================scope bind=========================*/
                $scope.toValidate = false;
                $scope.errorMsg = {
                    text: "",
                    show: false
                }
                $scope.rate = {
                    powerRateId: 0,
                    rateName: "",
                    rateTypeId: 1,
                    powerCompany: "",
                    powerCost: []
                }
                $scope.powerRates = params.powerRates;
                $scope.removeCost = function (index) {
                    if (!$scope.rate.status) {
                        $scope.rate.status = "updated"
                    }
                    if ($scope.rate.powerCost.length > 1) {
                        $scope.rate.powerCost[index - 1].toDate = null;
                    }
                    $scope.rate.powerCost.splice(index, 1);
                    validate();
                }
                $scope.getDate = function (isoDate) {
                    if (isoDate) {
                        return moment(isoDate).format("DD/MM/YYYY")
                    }
                    return "";
                }
                $scope.addPowerCostDialog = function () {
                    var minDate = 0;
                    var lastPrice = -1;
                    var isDefault = false;
                    if ($scope.rate.powerCost.length > 0) {
                        minDate = $scope.rate.powerCost[$scope.rate.powerCost.length - 1].fromDate;
                        lastPrice = $scope.rate.powerCost[$scope.rate.powerCost.length - 1].costPerKWH
                    }
                    if ($scope.rate.powerCost.length == 0) {
                        minDate = params.installationDT;
                        isDefault = true
                    }
                    var modal = $uibModal.open({
                        templateUrl: 'views/settings/dialogs/addPowerCost.html',
                        resolve: {
                            params: function () {
                                return {
                                    isDefault: isDefault,
                                    lastPrice: lastPrice
                                }
                            }
                        },
                        controller: secDialogController,
                        backdrop: 'static'
                    });
                    modal.rendered.then(function () {
                        var today = new Date();
                        var dateOptions = {
                            format: 'MM/DD/YYYY',
                            defaultDate: today,
                        }
                        if (minDate != 0) {
                            if (isDefault) {
                                dateOptions.defaultDate = minDate;
                            } else {
                                minDate = moment(minDate).add(1, "days");
                                dateOptions.defaultDate = moment(minDate).isBefore(today) ? today : minDate;
                            }
                            dateOptions.minDate = minDate;
                        }
                        //start date time  picker
                        $('.power-plug-date-picker').datetimepicker(dateOptions);
                    });
                    modal.closed.then(function () {
                        //remove date & time picker
                        $('.power-plug-date-picker').datetimepicker('remove');
                    });

                    modal.result.then(function (costPerKWH) {
                        var powerCost = {}
                        powerCost.fromDate = moment($('.power-plug-date-picker').data("date"), 'MM/DD/YYYY').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
                        powerCost.costPerKWH = parseFloat(costPerKWH);
                        if ((minDate != 0) && ($scope.rate.powerCost.length > 0)) {
                            $scope.rate.powerCost[$scope.rate.powerCost.length - 1].toDate = powerCost.fromDate;
                        }
                        $scope.rate.powerCost.push(powerCost);
                        validate();
                    });

                    return modal;

                    function secDialogController($scope, $uibModalInstance, $document, params) {
                        var toValidate = false;
                        $scope.isReadOnly = params.isDefault;
                        $scope.isValide = { error: false, message: "" };
                        $scope.costPerKWH = 0;
                        $scope.add = function () {
                            toValidate = true;
                            if (!$scope.validate()) {
                                return
                            }
                            $uibModalInstance.close($scope.costPerKWH);
                        };

                        $scope.validate = function () {
                            if (toValidate) {
                                if ($scope.costPerKWH <= 0) {
                                    $scope.isValide.error = true;
                                    $scope.isValide.toValidate = true;
                                    $scope.isValide.message = "Please enter Power Cost";
                                    return false;
                                }
                                if (parseFloat($scope.costPerKWH) == parseFloat(params.lastPrice)) {
                                    $scope.isValide.error = true;
                                    $scope.isValide.toValidate = true;
                                    $scope.isValide.message =
                                        "Power Rate cost must be diffrent than the last Power Rate Cost Defined for this Power Rate.";
                                    return false;
                                }
                                $scope.isValide = { error: false, message: "", toValidate: true };
                                return true;
                            }
                            return true;
                        }
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }
                }
                $scope.add = function () {
                    $scope.toValidate = true;
                    if (!validate()) {
                        return
                    }
                    updateRate();
                    $uibModalInstance.close($scope.costPerKWH);
                }
                $scope.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                /***********************init***************************/
                init();
            }

        }
    }
}());