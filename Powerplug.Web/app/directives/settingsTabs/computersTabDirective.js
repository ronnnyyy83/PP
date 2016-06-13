(function () {
    'use strict';
    angular
        .module('powerPlug').directive('computersTab', ['$uibModal', 'ComputersResource', function ($uibModal, ComputersResource) {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/computers.html',
                scope: {
                    jsonobject: '='
                },
                link: function (scope, element, attrs) {
                    //private
                    function onError(err) {
                        console.log(err)
                        if (err.status === 401 || err.status === -1) {
                            $state.go('login');
                        }
                    }

                    scope.removeSavingComputer = function (computerId) {
                        angular.forEach(scope.jsonobject.computersNotRun, function (value, key) {
                            if (computerId === value.computerKey) {
                                scope.jsonobject.computersNotRun.splice(key, 1);
                            }
                        });
                    };

                    scope.addSavingComputer = function (ev, computerId, type) {
                        $uibModal.open({
                            templateUrl: 'views/common/dialogs/computerCondition.html',
                            controller: DialogController,
                            backdrop: 'static',
                            size: 'large'
                        });
                        function DialogController($scope, $uibModalInstance, $document) {
                            ComputersResource.query(function (data) {
                                $scope.savingComputerList = data;
                            }, function (err) {
                                onError(err);
                            });

                            // tmp data for treeview
                            $scope.myData = [{
                              name: 'PowerPlug - QA'
                            //}, {
                            //  name: 'PowerPlug Database',
                            //  children: [{
                            //    name: '1subItem01',
                            //    children: [{
                            //      name: 'subItem101'
                            //    }, {
                            //      name: 'subItem102'
                            //    }]
                            //  }, {
                            //    name: 'subItem02'
                            //  }, {
                            //    name: 'subItem03',
                            //    children: [{
                            //      name: 'subItem301'
                            //    }, {
                            //      name: 'subItem302'
                            //    }]
                            //  }, {
                            //    name: 'subItem04'
                            //  }, {
                            //    name: 'subItem05'
                            //  }, {
                            //    name: 'subItem06',
                            //    children: [{
                            //      name: 'subItem601'
                            //    }, {
                            //      name: 'subItem602'
                            //    }]
                            //  }]
                            }];
                            // end tmp data for treeview

                            $scope.addSavingComputers = function () {
                                angular.forEach(angular.element('.computer-selection:checked'), function (value, key) {
                                    var newComputerName = value.getAttribute('data-name');
                                    var isExist = false;
                                    if (scope.jsonobject && scope.jsonobject.computersNotRun) {
                                        angular.forEach(scope.jsonobject.computersNotRun, function (valueContainer, keyContainer) {
                                            if (valueContainer.name === newComputerName) {
                                                isExist = true;
                                            }
                                        });
                                    }

                                    if (!isExist) {
                                        if (!scope.jsonobject) {
                                            scope.jsonobject = {};
                                        }

                                        if (!scope.jsonobject.computersNotRun) {
                                            scope.jsonobject.computersNotRun = [];
                                        }
                                        scope.jsonobject.computersNotRun.push({ computerKey: scope.jsonobject.computersNotRun.length, name: newComputerName });
                                    }
                                });

                                $uibModalInstance.close();
                            };

                            $scope.closeSavingComputers = function () {
                                $uibModalInstance.dismiss();
                            };
                        }
                    };
                }
            }
        }])
}());
