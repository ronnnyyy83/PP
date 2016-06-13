var computersHandler = {
    vm: {},
    init: function (vm, $scope, $document, $uibModal, ComputersResource, ComputerGroupsResource) {
        computersHandler.vm = vm;
        computersHandler.$scope = $scope;
        computersHandler.$document = $document;
        computersHandler.$uibModal = $uibModal;
        computersHandler.ComputersResource = ComputersResource;
        computersHandler.ComputerGroupsResource = ComputerGroupsResource;
        computersGroupDialogHandler.init($uibModal, ComputerGroupsResource);
        computersNameDialodHandler.init($uibModal, ComputersResource, ComputerGroupsResource);

    },
    setComputerItems: function () {
        computersHandler.vm.computersFromDB = [];
        computersHandler.vm.computerGroupsFromDB = [];
        if (computersHandler.vm.savingPlan.computers) {
            angular.forEach(computersHandler.vm.savingPlan.computers, function (valueComputer, keyComputer) {
                computersHandler.vm.computersFromDB.push(valueComputer);
            });
        }
        if (computersHandler.vm.savingPlan.compGroups) {
            angular.forEach(computersHandler.vm.savingPlan.compGroups, function (valueComputerGroup, keyComputerGroup) {
                computersHandler.vm.computerGroupsFromDB.push(valueComputerGroup);
            });
        }
    },
    addComputerDialog: function (computersArr) {
        computersNameDialodHandler.addComputerDialog(computersArr, false);
    },
    addComputerGroupsDialog: function (groupsArr) {
        computersGroupDialogHandler.addComputerGroupsDialog(groupsArr);
    },
    removeComputerGroups: function () {
        angular.forEach(angular.element('.computer-group-selection:checked'), function (value, key) {
            var computerGroupId = value.getAttribute('id');
            computersHandler.removeComputerGroupById(computerGroupId);
        });
    },
    removeComputerGroupById: function (computerGroupId) {
        angular.forEach(computersHandler.vm.savingPlan.compGroups, function (valueCompGroup, keyCompGroup) {
            if (computerGroupId === valueCompGroup.groupGUID) {
                computersHandler.vm.savingPlan.compGroups.splice(keyCompGroup, 1);
            }
        });

    },
    removeComputers: function () {
        angular.forEach(angular.element('.computer-selection:checked'), function (value, key) {
            var computerName = value.getAttribute('data-name');
            computersHandler.removeComputerByName(computerName);
        });
    },
    removeComputerByName: function (computerName) {
        angular.forEach(computersHandler.vm.savingPlan.computers, function (valueComputer, keyComputer) {
            if (computerName === valueComputer.name) {
                computersHandler.vm.savingPlan.computers.splice(keyComputer, 1);
            }
        });
    },
    prepareComputersDelta: function () {
        addedComputers = [];
        removedComputers = [];

        angular.forEach(computersHandler.vm.computersFromDB, function (valueDB, keyDB) {
            var isItemExist = false;
            angular.forEach(computersHandler.vm.savingPlan.computers, function (valueComputer, keyComputer) {
                if (valueComputer.name === valueDB.name) {
                    isItemExist = true;
                }
            });
            if (!isItemExist) {
                removedComputers.push(valueDB);
            }
        });

        angular.forEach(computersHandler.vm.savingPlan.computers, function (valueComputer, keyComputer) {
            var isItemExist = false;
            angular.forEach(computersHandler.vm.computersFromDB, function (valueDB, keyDB) {
                if (valueComputer.name === valueDB.name) {
                    isItemExist = true;
                }
            });
            if (!isItemExist) {
                addedComputers.push(valueComputer);
            }
        });

        computersHandler.vm.savingPlan.addComputers = addedComputers;
        computersHandler.vm.savingPlan.removeComputers = removedComputers;
    },
    prepareComputerGroupsDelta: function () {
        addedComputerGroups = [];
        removedComputerGroups = [];

        angular.forEach(computersHandler.vm.computerGroupsFromDB, function (valueDB, keyDB) {
            var isItemExist = false;
            angular.forEach(computersHandler.vm.savingPlan.compGroups, function (valueComputerGroup, keyComputerGroup) {
                if (valueComputerGroup.groupGUID === valueDB.groupGUID) {
                    isItemExist = true;
                }
            });
            if (!isItemExist) {
                removedComputerGroups.push(valueDB);
            }
        });

        angular.forEach(computersHandler.vm.savingPlan.compGroups, function (valueComputerGroup, keyComputerGroup) {
            var isItemExist = false;
            angular.forEach(computersHandler.vm.computerGroupsFromDB, function (valueDB, keyDB) {
                if (valueComputerGroup.groupGUID === valueDB.groupGUID) {
                    isItemExist = true;
                }
            });
            if (!isItemExist) {
                addedComputerGroups.push(valueComputerGroup);
            }
        });

        computersHandler.vm.savingPlan.addCompGroups = addedComputerGroups;
        computersHandler.vm.savingPlan.removeCompGroups = removedComputerGroups;
    }
};
