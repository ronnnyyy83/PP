var computersNameDialodHandler = {
    init: function ($uibModal, ComputersResource, ComputerGroupsResource) {
        computersNameDialodHandler.$uibModal = $uibModal;
        computersNameDialodHandler.ComputersResource = ComputersResource;
        computersNameDialodHandler.ComputerGroupsResource = ComputerGroupsResource;
    },
    addComputerDialog: function (computersArr, isSingleSelection) {
        return computersNameDialodHandler.$uibModal.open({
            templateUrl: 'views/common/dialogs/computerCondition.html',
            resolve: { computersArr: function () { return computersArr }, isSingleSelection: function () { return isSingleSelection } },
            controller: DialogController,
            size: 'large',
            backdrop: 'static'
        });
        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }
        function DialogController($scope, $uibModalInstance, $document, computersArr, isSingleSelection) {
            computersNameDialodHandler.ComputersResource.query(function (data) {
                data.forEach(function (item) {
                    item.checked = false;
                });
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
            //    name: '2subItem01',
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

            $scope.updateSelection = function (position) {
                if (isSingleSelection) {
                    angular.forEach($scope.savingComputerList, function (item, index) {
                        if (position != index)
                            item.checked = false;
                    });
                }
            }
            $scope.addSavingComputers = function () {
                angular.forEach($scope.savingComputerList, function (computer, key) {
                    if (computer.checked) {
                        var newComputerName = computer.name;
                        var isExist = false;
                        if (computersArr) {
                            computersArr.forEach(function (valueContainer, keyContainer) {
                                if ((valueContainer.memberTypeId  === 1 && valueContainer.memberDef === newComputerName)
                                    || (valueContainer.name === newComputerName)) {
                                    isExist = true;
                                }
                            });
                        }
                        if (!isExist) {
                            if (!computersArr) {
                                computersArr = [];
                            }
                            computersArr.push({ name: newComputerName });
                        }
                    }
                });
                $uibModalInstance.close('Add');
            };
            $scope.closeSavingComputers = function () {
                $uibModalInstance.dismiss();
            };
        }

    },
};
