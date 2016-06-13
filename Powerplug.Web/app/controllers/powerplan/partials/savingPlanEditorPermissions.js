var permissionHandler = {
    vm: {},
    init: function (vm, $scope, $document, $uibModal) {
        permissionHandler.vm = vm;
        permissionHandler.$scope = $scope;
        permissionHandler.$document = $document;
        permissionHandler.$uibModal = $uibModal;
    },
    addPermissionsDialog: function (ev) {
        permissionHandler.$uibModal.open({
            templateUrl: 'views/powerplan/dialogs/addPermission.html',
            controller: DialogController,
            backdrop: 'static',
            size: 'large'
        });

        function DialogController($scope, $uibModalInstance, $document) {
            $scope.addPermission = function () {
                $uibModalInstance.close();
            }

            $scope.closePermissionDialog = function () {
                $uibModalInstance.dismiss();
            }
            // Select all checkboxes function in add script dialog
            $scope.checkAll = function (seed) {
                    switch (seed) {
                    case 'users':
                        {
                            if ($scope.selectedAllUsers) {
                                $scope.selectedAllUsers = true;
                            } else {
                                $scope.selectedAllUsers = false;
                            }
                            angular.forEach($scope.users, function (user) {
                                user.selected = $scope.selectedAllUsers;
                            });
                            break;
                        }
                    default:
                        console.log('Error. Default value of select all (groups or comps) agr');
                    }
                }

            // End select all checkboxes function in add script dialog

            // tmp model for filling Add Permissions dialog
            $scope.users = [{
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }, {
                name: 'User Name',
                logonName: 'Logon Name',
                description: 'Description',
                isInFolder: true
            }]

            // end tmp model for filling Add Permissions dialog

        }

    }
};
