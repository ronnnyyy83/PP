var editWakeupPermissionHandler = (function () {
    var api = {};
    var _uibModal;
    api.init = function (vm, $uibModal, ComputersResource, ComputerGroupsResource) {
        _uibModal = $uibModal;
        _vm = vm;
        computersNameDialodHandler.init($uibModal, ComputersResource, ComputerGroupsResource);

    },

    api.openDialog = function (permissionGuid) {
        appMetric = 's';
        return _uibModal.open({
            templateUrl: 'views/settings/dialogs/editWakeupPortalPermission.html',
            resolve: { permissionGuid: function () { return permissionGuid; } },
            controller: DialogController,
            backdrop: 'static'
        });
        function DialogController($scope, $uibModalInstance, permissionGuid) {
            var permission = {};
            angular.forEach(_vm.wakeupData.permissions, function (value, key) {
                if (permissionGuid && permissionGuid === value.guid) {
                    permission = value;
                    $scope.permission = permission
                }
            });

            if (!$scope.permission) {
                $scope.permission = { guid: _vm.generateGuid(), allow : true };
            }
            $scope.toValidate = false
            $scope.validateFields = function () {
                if ($scope.toValidate) {
                    if ($scope.editPermission.$error.required && $scope.editPermission.$error.required.length > 0) {
                        $scope.isValide.error = true;
                        $scope.isValide.message = "Please Fill All Required Fields"
                    }
                    else {
                        $scope.isValide.error = false;
                    }
                 
                }
            }
            $scope.openDialog = function () {
                var computersArr = [];
                var model =computersNameDialodHandler.addComputerDialog(computersArr, true);
                model.result.then(function () {
                    if (computersArr.length > 0) {
                        $scope.permission.computerName = computersArr[0].name;
                    }
                })
            }
            $scope.isValide = { error: false, message: "" };
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };

            $scope.addUpdatePermission = function () {
                $scope.toValidate = true;
                $scope.validateFields();
                if ($scope.isValide.error === false) {
                    if (permissionGuid) {
                        permission = $scope.permission;
                    }
                    else {
                        _vm.wakeupData.permissions.push($scope.permission);
                    }

                    $uibModalInstance.close();                    
                }
                //=======================init=========================
            }
        }
    }
    return api;
}());