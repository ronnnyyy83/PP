(function () {
    'use strict';
    angular
        .module('powerPlug').directive('applicationTab', ['$uibModal', function ($uibModal) {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/applications.html',
                scope: {
                    jsonobject: '=',
                    worktype: '@',
                    saveEvent: '=' //Indcates there is no event that save the data to json .. every change is made will be made on the original json
                },
                link: function (scope, element, attrs) {
                    //copy array appMetrics - init
                    if (!scope.saveEvent) {
                        scope.$watch('jsonobject', function (newValue, oldValue) {
                            if (typeof (newValue) != 'undefined') {
                                if (typeof (newValue.appMetrics) === 'undefined') {
                                    newValue.appMetrics = [];
                                }
                            scope.appMetrics = newValue.appMetrics;
                            }
                        });
                    } else if (typeof (scope.jsonobject) != 'undefined') {
                        if (scope.jsonobject.appMetrics === undefined) {
                            scope.jsonobject.appMetrics = [];
                        }
                        //Deep Copy -- only on saveSettings event the json would change
                        scope.appMetrics = jQuery.extend(true, [], scope.jsonobject.appMetrics);
                    }
                   
                    scope.addSavingApplication = function (ev, appId, type) {
                        var appMetric = { appKey: scope.appMetrics.length };
                        angular.forEach(scope.appMetrics, function (value, key) {
                            if (appId === value.appKey) {
                                appMetric = value;
                            }
                        });
                        
                        $uibModal.open({
                            templateUrl: 'views/powerplan/dialogs/applicationCondition.html',
                            resolve: { appMetric: function () { return appMetric;}},
                            controller: DialogController,
                            backdrop: 'static'
                        })

                        function DialogController($scope, $uibModalInstance, $document, appMetric) {

                            $scope.appMetric = appMetric;
                            if (!$scope.appMetric.counter) {
                                $scope.appMetric.counter = 'Running';
                            }
                            $scope.toValidate = false;
                            $scope.isValide = { error: false, message: "" };
                            $scope.threshold = {
                                Io: 0,
                                Cpu: 0
                            }
                            if (appMetric.counter === 'Io') {
                                $scope.threshold.Io = appMetric.threshold / 1024;
                            } else if (appMetric.counter === 'Cpu') {
                                $scope.threshold.Cpu = appMetric.threshold;
                            }
                            $scope.copyExeName = function (fileEl) {
                                var fileName = fileEl.value;
                                var lastIndex = fileName.lastIndexOf("\\");
                                if (lastIndex >= 0) {
                                    fileName = fileName.substring(lastIndex + 1).replace('.exe', '');
                                }
                                appMetric.appName = fileName;
                                $scope.$digest();
                            };
                            $scope.validateFields = function () {
                                if ($scope.toValidate) {
                                    if ($scope.newApp.$error.required && $scope.newApp.$error.required.length > 0) {
                                        $scope.isValide.error = true;
                                        $scope.isValide.message = "Please Fill Application Process Field"
                                   } else {
                                        $scope.isValide = { error: false, message: "" };
                                    }
                                }
                            }
                            $scope.upsertSavingApplication = function (appId) {
                                $scope.toValidate = true;
                                $scope.validateFields();
                                if ($scope.isValide.error === false) {
                                    var exeName = angular.element('#exeName')[0].value.replace('.exe', '');
                                    var counter;
                                    var threshold = 0;

                                    switch (appMetric.counter) {
                                        case 'Cpu':
                                            threshold = $scope.threshold.Cpu ? $scope.threshold.Cpu : 0 ;
                                            break;
                                        case 'Io':
                                            threshold = $scope.threshold.Io * 1024 ? $scope.threshold.Io * 1024 : 0;
                                            break;
                                        default:
                                            threshold = 0;
                                    }
                                    if (scope.appMetrics && (appId < scope.appMetrics.length)) {
                                        appMetric.appName = exeName;
                                        appMetric.threshold = threshold;
                                    }
                                    else {
                                        scope.appMetrics.push({ appKey: appId, appName: exeName, counter: appMetric.counter, threshold: threshold });
                                    }
                                    $uibModalInstance.close();
                                }
                            };

                            $scope.closeSavingApplication = function () {
                                $uibModalInstance.dismiss();
                            };
                        }
                    };
                    scope.removeSavingApplication = function (appId, type) {
                        angular.forEach(scope.appMetrics, function (value, key) {
                            if (appId === value.appKey) {
                                scope.appMetrics.splice(key, 1);           
                            }
                        });
                    };
                    //Save changes 
                    scope.$on('saveSettings', function (event, data) {
                        scope.jsonobject.appMetrics = jQuery.extend(true, [], scope.appMetrics);
                    });
            
                }
            }
        }])
}());