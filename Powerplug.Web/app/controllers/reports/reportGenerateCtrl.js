(function () {
    'use strict';
    angular

        .module('powerPlug')
        .controller('ReportGenerateCtrl', ['$state', '$stateParams', '$timeout', '$uibModal', '$document', '$http', 'appSettings', 'ReportsResource', 'ReportListService', 'ReportTemplateService', 'ComputersResource', 'ComputerGroupsResource', ReportGenerateCtrl]);

    function ReportGenerateCtrl($state, $stateParams, $timeout, $uibModal, $document, $http, appSettings, ReportsResource, ReportListService, ReportTemplateService, ComputersResource, ComputerGroupsResource) {
        var vm = this;
        vm.reportId = $stateParams.reportId;
        vm.templateId = $stateParams.templateId;
        computersNameDialodHandler.init($uibModal, ComputersResource, ComputerGroupsResource);
        computersGroupDialogHandler.init($uibModal, ComputerGroupsResource);        

        vm.years = [];        
        for (var i = 2000; i <= (new Date().getFullYear() + 1) ; i++) {
            vm.years.push(i);
        }

        vm.months = [{ key: 0, value: 'January' }, { key: 1, value: 'February' }, { key: 2, value: 'March' }, { key: 3, value: 'April' }, { key: 4, value: 'May' }, { key: 5, value: 'June' }, { key: 6, value: 'July' }, { key: 7, value: 'August' }, { key: 8, value: 'September' }, { key: 9, value: 'October' }, { key: 10, value: 'November' }, { key: 11, value: 'December' }];
        
        getDataFromApi();

        if (!$document.mCustomScrollbar) {
            $document.__proto__.mCustomScrollbar = $.mCustomScrollbar;
        }

        vm.config = {
            autoHideScrollbar: false,
            theme: 'light',
            advanced: {
                updateOnContentResize: true
            },
            setHeight: 150,
            scrollInertia: 0
        }

        vm.configSmaller = {
            autoHideScrollbar: false,
            theme: 'light',
            advanced: {
                updateOnContentResize: true
            },
            setHeight: 120,
            scrollInertia: 0
        }

        function getDataFromApi() {
            vm.weekDays = 0;
            if (vm.templateId) {
                ReportTemplateService.getReportTemplate(vm.templateId, function (templateData) {
                    vm.reportData = JSON.parse(JSON.stringify(templateData));
                    if (!vm.reportData) {
                        loadDefaultReportData(onReportsSuccess);
                    }
                    else {
                        onReportsSuccess();
                    }
                });
            }
            else {
                loadDefaultReportData(onReportsSuccess);
            }
        }
        
        function loadDefaultReportData(cb) {
            ReportsResource.basic.get({ reportId: vm.reportId }, function (data) {
                vm.reportData = data;
                cb();
            }, function (err) {
                onError(err);
            });
        }
                
        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function fillData() {
            if (vm.reportData.monthsFilter === false) {
                vm.reportData.fromDateConverted = new Date(vm.reportData.fromDate);
                vm.reportData.toDateConverted = new Date(vm.reportData.toDate);
                $timeout(function () {
                    $('.from-date').datetimepicker({
                        format: 'MM/DD/YYYY',
                        defaultDate: vm.reportData.fromDateConverted
                    });
                    $('.to-date').datetimepicker({
                        format: 'MM/DD/YYYY',
                        defaultDate: vm.reportData.toDateConverted
                    });
                    $('.from-date').data("DateTimePicker").date(vm.reportData.fromDateConverted);
                    $('.to-date').data("DateTimePicker").date(vm.reportData.toDateConverted);

                }, 0);
            }
            else if (vm.reportData.monthsFilter === true) {
                vm.reportData.fromDate = new Date(vm.reportData.fromDate);
                vm.reportData.toDate = new Date(vm.reportData.toDate);
                vm.selectedFromMonth = vm.reportData.fromDate.getMonth();
                vm.selectedFromYear = vm.reportData.fromDate.getFullYear();
                vm.selectedToMonth = vm.reportData.toDate.getMonth();
                vm.selectedToYear = vm.reportData.toDate.getFullYear();
            }

            if (!vm.reportData.computers) {
                vm.reportData.computers = [];
            }

            if (!vm.reportData.groups) {
                vm.reportData.groups = [];
            }

            loadDays();
        }
        
        function onReportsSuccess() {            
            ReportListService.getReport(vm.reportId, function (reportData) {
                vm.reportBaseData = reportData;
                fillBaseData();
            });

            fillData();
        }

        function fillBaseData() {
            vm.reportData.reportName = vm.reportBaseData.reportName;
            vm.reportData.output = vm.reportBaseData.output;
            if (vm.reportData.output.length > 0) {
                vm.reportData.operation = vm.reportData.output[0];
            }
        }

        function loadDays() {
            vm.daysArr = [];
            vm.weekDays = 0;
            angular.forEach(vm.reportData.usageDays, function (value, key) {
                vm.weekDays += value;
                var weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var days = value.toString(2);
                var numbers = [];
                var selectedDays = [];
                days = days.split("").reverse().join("");
                var lastNumber = 0;
                var lastText = '';
                var scheduleText = '';
                var continued = false;
                for (var i = 0; i < days.length; i++) {                    
                    if (days[i] === '1') {
                        if (lastNumber === 0) {
                            scheduleText += weekDayNames[i] + ', ';
                        }
                        else {
                            scheduleText = scheduleText.replace(/, $/, '');
                            continued = true;
                        }
                        lastNumber = 1;
                    }
                    else {
                        if (continued) {
                            continued = false;
                            scheduleText += ' - ' + weekDayNames[i - 1];
                        }
                        lastNumber = 0;
                    }
                }

                if (continued) {
                    continued = false;
                    scheduleText += ' - ' + weekDayNames[i - 1];
                }
                
                scheduleText = scheduleText.replace(/, $/, '');
                vm.daysArr.push(scheduleText);
            });
        }

        vm.addComputerDialog = function () {
            computersNameDialodHandler.addComputerDialog(vm.reportData.computers, false);
        }

        vm.addComputerGroupDialog = function () {
            computersGroupDialogHandler.addComputerGroupsDialog(vm.reportData.groups);
        }

        vm.removeComputer = function () {
            angular.forEach(vm.reportData.groups, function (value, key) {
                if (value.groupGUID === vm.reportData.selectedComputer) {
                    vm.reportData.groups.splice(key, 1);
                }
            });

            angular.forEach(vm.reportData.computers, function (value, key) {
                if (value.name === vm.reportData.selectedComputer) {
                    vm.reportData.computers.splice(key, 1);
                }
            });
        }

        vm.moveUp = function () {
            angular.forEach(vm.reportData.sortOrder, function (value, key) {
                if (value.field === vm.reportData.selectedSort && key > 0) {
                    var temp = vm.reportData.sortOrder[key - 1];
                    vm.reportData.sortOrder[key - 1] = vm.reportData.sortOrder[key];
                    vm.reportData.sortOrder[key] = temp;
                }
            });            
        }

        vm.moveDown = function () {
            var isFound = false;
            angular.forEach(vm.reportData.sortOrder, function (value, key) {
                if (value.field === vm.reportData.selectedSort && key < vm.reportData.sortOrder.length - 1 && !isFound) {
                    var temp = vm.reportData.sortOrder[key + 1];
                    vm.reportData.sortOrder[key + 1] = vm.reportData.sortOrder[key];
                    vm.reportData.sortOrder[key] = temp;
                    isFound = true;
                }
            });
        }

        vm.removeDays = function () {
            angular.forEach(vm.daysArr, function (value, key) {
                if (value === vm.reportData.selectedDay) {
                    vm.reportData.usageDays.splice(key, 1);
                }
            });
            loadDays();
        }

        vm.addDaysDialog = function () {
            $uibModal.open({
                templateUrl: 'views/reports/dialogs/addDays.html',
                controller: DialogController,
                backdrop: 'static',
                size: 'days-size'
            });

            function DialogController($scope, $uibModalInstance, $document) {
                $scope.days = [{ index: 1, name: 'Sunday', disabled: (1 & vm.weekDays) == 1 },
                    { index: 2, name: 'Monday', disabled: (2 & vm.weekDays) == 2 },
                    { index: 4, name: 'Tuesday', disabled: (4 & vm.weekDays) == 4 },
                    { index: 8, name: 'Wednesday', disabled: (8 & vm.weekDays) == 8 },
                    { index: 16, name: 'Thursday', disabled: (16 & vm.weekDays) == 16 },
                    { index: 32, name: 'Friday', disabled: (32 & vm.weekDays) == 32 },
                    { index: 64, name: 'Saturday', disabled: (64 & vm.weekDays) == 64 }];

                $scope.addDays = function () {
                    var isSelected = false;
                    var daysBit = 0;
                    angular.forEach($scope.days, function (value, key) {
                        if (value.selected === true) {
                            isSelected = true;
                            daysBit += value.index;
                        }
                    });

                    if (isSelected) {
                        vm.reportData.usageDays.push(daysBit);
                        loadDays();
                    }
                    
                    $uibModalInstance.close();
                };

                $scope.closeDaysDialog = function () {
                    $uibModalInstance.dismiss();
                };
            }
        }

        function setJsonParams() {
            if (vm.reportData.monthsFilter === false) {
                vm.reportData.fromDate = $('.from-date').data("DateTimePicker").date().format('YYYY-MM-DD');
                vm.reportData.toDate = $('.to-date').data("DateTimePicker").date().format('YYYY-MM-DD');
            }
            else if (vm.reportData.monthsFilter === true) {
                vm.reportData.fromDate = vm.selectedFromYear + '-' + ((vm.selectedFromMonth + 1) < 10 ? '0' + (vm.selectedFromMonth + 1) : (vm.selectedFromMonth + 1)) + '-01';
                vm.reportData.toDate = vm.selectedToYear + '-' + ((vm.selectedToMonth + 1) < 10 ? '0' + (vm.selectedToMonth + 1) : (vm.selectedToMonth + 1)) + '-01';
            }
        }

        vm.generateReport = function () {
            setJsonParams();

            var saveByteArray = (function () {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                return function (data, name, type) {
                    var blob = new Blob([data], { type: type }),
                        url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = name;
                    a.click();
                    window.URL.revokeObjectURL(url);
                };
            }());

            $http.post(appSettings.serverPath + 'api/pc/reports/', vm.reportData, { responseType: "arraybuffer" }).
                success(function (data) {
                    if (vm.reportData.operation === 'PDF') {
                        var file = new Blob([data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    }
                    else if (vm.reportData.operation === 'CSV') {
                        saveByteArray(data, vm.reportData.title + '.csv', 'octet/stream');
                    }
                    else if (vm.reportData.operation === 'Excel') {
                        saveByteArray(data, vm.reportData.title + '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    }                    
                }).
                error(function (data, status) {
                    if (status === 401 || status === -1) {
                        $state.go('login');
                    }
                    else if (status === 404) {
                        alert('No Data Found');
                    }
                });
        }        

        vm.cancel = function () {
            getDataFromApi();
        }

        vm.saveTemplateDialog = function () {
            $uibModal.open({
                templateUrl: 'views/reports/dialogs/addTemplate.html',
                controller: DialogController,
                backdrop: 'static'
            });

            function DialogController($scope, $uibModalInstance, $document) {
                $scope.reportData = vm.reportData;
                $scope.maxRelative = 31;
                if (vm.reportData.monthsFilter === true) {
                    $scope.maxRelative = 6;
                }

                if (vm.templateId <= 3) {
                    $scope.reportData.savedReportName = '';
                }

                $scope.checkFromRelative = function () {
                    if ($scope.reportData.fromRelative > $scope.maxRelative) {
                        $scope.reportData.fromRelative = $scope.maxRelative;
                    }

                    if ($scope.reportData.fromRelative < 0) {
                        $scope.reportData.fromRelative = 0;
                    }
                }

                $scope.checkToRelative = function () {
                    if ($scope.reportData.toRelative > $scope.maxRelative) {
                        $scope.reportData.toRelative = $scope.maxRelative;
                    }

                    if ($scope.reportData.toRelative < 0) {
                        $scope.reportData.toRelative = 0;
                    }
                }

                $scope.changeTimeframe = function () {
                    if ($scope.reportData.timeframe === 'Days') {
                        $scope.maxRelative = 31;
                    }
                    else if ($scope.reportData.timeframe === 'Months') {
                        $scope.maxRelative = 6;
                    }
                    else if ($scope.reportData.timeframe === 'Weeks') {
                        $scope.maxRelative = 9;
                    }
                    else if ($scope.reportData.timeframe === 'Quarters') {
                        $scope.maxRelative = 3;
                    }

                    if ($scope.reportData.fromRelative > $scope.maxRelative) {
                        $scope.reportData.fromRelative = $scope.maxRelative;
                    }
                    if ($scope.reportData.toRelative > $scope.maxRelative) {
                        $scope.reportData.toRelative = $scope.maxRelative;
                    }

                    if ($scope.reportData.fromRelative < 0) {
                        $scope.reportData.fromRelative = 0;
                    }
                    if ($scope.reportData.toRelative < 0) {
                        $scope.reportData.toRelative = 0;
                    }
                }
                $scope.addTemplate = function () {
                    if (!validate()) {
                        alert("Please fill all fields!");
                        return false;
                    }
                    setJsonParams();
                    if (vm.templateId && vm.templateId > 3) {
                        ReportsResource.template.update({templateId : vm.templateId}, vm.reportData, function (data) {
                            vm.reportData = data;
                            fillBaseData();
                            ReportTemplateService.refreshTemplates();
                            fillData();
                        }, function (err) {
                            onError(err);
                        });
                    }
                    else {
                        ReportsResource.template.save(vm.reportData, function (data) {
                            vm.reportData = data;
                            vm.templateId = vm.reportData.savedReportId;
                            fillBaseData();
                            ReportTemplateService.refreshTemplates();
                            fillData();
                        }, function (err) {
                            onError(err);
                        });
                    }
                    $uibModalInstance.close();
                };

                $scope.closeDialog = function () {
                    $uibModalInstance.dismiss();
                };

                function validate() {
                    var isValid = true;
                    if (!$scope.reportData.savedReportName || $scope.reportData.savedReportName.length === 0) {
                        isValid = false;
                    }

                    if (vm.reportData.monthsFilter && (!$scope.reportData.fromRelative || !$scope.reportData.toRelative)) {
                        isValid = false;
                    }
                    return isValid;
                }
            }
        }
    }
}());