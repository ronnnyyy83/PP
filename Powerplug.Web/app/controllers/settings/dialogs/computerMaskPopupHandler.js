var computerMaksPopupHandler = {
    vm: {},
    init: function (vm, $uibModal) {
        computerMaksPopupHandler.vm = vm;
        computerMaksPopupHandler.$uibModal = $uibModal;
    },
 
    openComputerMaskDialog: function (computerIndex) {
        return computerMaksPopupHandler.$uibModal.open({
            templateUrl: 'views/settings/dialogs/computerMask.html',
            resolve: { computerIndex: function () { return computerIndex } },
            backdrop: 'static',
            controller: DialogController
        });

        function DialogController($scope, $uibModalInstance, computerIndex) {
            //===============private===============/
            var _selectedGroup;
            var _returnObjByPromise = { computerFields: {} };
            function addComputerObjectToJson() {
                if (computerIndex >= 0) {
                    _returnObjByPromise.computerFields.memberDef = $scope.computerName;
                    _returnObjByPromise.computerFields.memberTypeId = $scope.memberTypeId;
                }
                else {
                    _returnObjByPromise.computerFields = {
                        "memberTypeId": $scope.memberTypeId,
                        "memberDef": $scope.computerName,
                    }
                }
            }
            function init() {
                _selectedGroup = computerMaksPopupHandler.vm.groupMembersHash[computerMaksPopupHandler.vm.selectedGroupId];
                if (computerIndex >= 0) {
                    $scope.computerName = _selectedGroup.members[computerIndex].memberDef;
                    $scope.memberTypeId = _selectedGroup.members[computerIndex].memberTypeId;
                }
            }
            //=============Scope Binding=============/  
            $scope.isChange = false;
            $scope.memberTypeId = 2;
            $scope.memberTypeOptions = [{ name: 'is like', value: 2 }, { name: 'is not like', value: 5 }];
            $scope.computerName = null;
            $scope.add = function () {
                addComputerObjectToJson();
                _returnObjByPromise.isChange = $scope.isChange;
                $uibModalInstance.close({ computerObject: _returnObjByPromise });
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            }
            //===============init================/
            init();
        }
    }
}