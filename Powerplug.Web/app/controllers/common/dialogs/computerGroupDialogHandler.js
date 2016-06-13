var computersGroupDialogHandler = {
    init: function  ($uibModal, ComputerGroupsResource) {
        computersGroupDialogHandler.$uibModal = $uibModal;
        computersGroupDialogHandler.ComputerGroupsResource = ComputerGroupsResource;
    },
    addComputerGroupsDialog: function (groupsArr) {
        computersGroupDialogHandler.$uibModal.open({
            templateUrl: 'views/powerplan/dialogs/computerGroups.html',
            controller: DialogController,
            resolve: { groupsArr: function () { return groupsArr } },
            backdrop: 'static',
            size: 'large'
        });

        function DialogController($scope, $uibModalInstance, $document, groupsArr) {
            computersGroupDialogHandler.ComputerGroupsResource.groups.query(function (data) {
                $scope.computerGroupsList = data;
            }, function (err) {
                $scope.onError(err);
            });

            $scope.checkAll = function (seed) {
                switch (seed) {
                    case 'groups':
                        {
                            if ($scope.selectedAllGroups) {
                                $scope.selectedAllGroups = true;
                            } else {
                                $scope.selectedAllGroups = false;
                            }
                            angular.forEach($scope.computerGroupsList, function (group) {
                                group.selected = $scope.selectedAllGroups;
                            });
                            break;
                        }
                    default:
                        console.log('Error. Default value of select all group agr');
                }
            }

            $scope.onError = function (err) {
                console.log('Please, give me some data to addComputerGroups dialog. ' + err.statusText);
            }

            $scope.addComputerGroups = function () {
                angular.forEach(angular.element('.computer-group-selection:checked'), function (value, key) {
                    var newComputerGroupId = value.getAttribute('id');
                    var newComputerGroupName = value.getAttribute('data-name');
                    var isExist = false;
                    if (groupsArr) {
                        angular.forEach(groupsArr, function (valueContainer, keyContainer) {
                            if (valueContainer.groupGUID === newComputerGroupId) {
                                isExist = true;
                            }
                        });
                    }

                    if (!isExist) {
                        if (!groupsArr) {
                            groupsArr = [];
                        }
                        groupsArr.push({
                            groupName: newComputerGroupName,
                            groupGUID: newComputerGroupId
                        });
                    }
                });

                $uibModalInstance.close();
            };

            $scope.closeComputerGroupsDialog = function () {
                $uibModalInstance.dismiss();
            };
        }

    },
};
