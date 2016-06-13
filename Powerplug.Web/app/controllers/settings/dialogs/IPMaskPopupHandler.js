var IPMaksPopupHandler = {
    vm: {},
    init: function (vm, $uibModal) {
        IPMaksPopupHandler.vm = vm;
        IPMaksPopupHandler.$uibModal = $uibModal;
    },
 
    openIPMaskDialog: function (computerIndex) {
        return IPMaksPopupHandler.$uibModal.open({
            templateUrl: 'views/settings/dialogs/IPMask.html',
            resolve: { computerIndex: function () { return computerIndex } },
            controller: DialogController,
            backdrop: 'static'
        });

        function DialogController($scope, $uibModalInstance, computerIndex) {
            //===============private===============/
            var _selectedGroup;
            var _returnObjByPromise = { computerFields: {} };
            function init() {
                var IPAdressArr;
                _selectedGroup = IPMaksPopupHandler.vm.groupMembersHash[IPMaksPopupHandler.vm.selectedGroupId];
                if (computerIndex >= 0) {
                    $scope.memberTypeId = _selectedGroup.members[computerIndex].memberTypeId;
                    IPAdressArr = _selectedGroup.members[computerIndex].memberDef.split('.', 4);
                    $scope.IP.part1 = IPAdressArr[0];
                    $scope.IP.part2 = IPAdressArr[1];
                    $scope.IP.part3 = IPAdressArr[2];
                    $scope.IP.part4 = IPAdressArr[3];
                } 
            }
            //=============Scope Binding=============/ 
            $scope.isChange = false;
            $scope.memberTypeId = 4;
            $scope.IP = { part1: null, part2: null, part3: null, part4: null}
            $scope.memberTypeOptions = [ { name: 'Equals', value: 4 }, { name: 'Not Equals', value: 6 }];
            $scope.add = function () {
                var memberDef;
                memberDef = $scope.IP.part1 + "." + $scope.IP.part2 + "." + $scope.IP.part3 + "." + $scope.IP.part4;
                _returnObjByPromise.computerFields = {
                    "memberTypeId": $scope.memberTypeId,
                    "memberDef": memberDef,
                }
                _returnObjByPromise.isChange = $scope.isChange;
                $uibModalInstance.close({ computerObject: _returnObjByPromise });
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss()
            }
            //===================Init=====================/
            init();
        }
    }
}