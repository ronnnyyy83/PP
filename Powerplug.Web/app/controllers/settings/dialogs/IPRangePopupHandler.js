var IPRangePopupHandler = {
    vm: {},
    init: function (vm, $uibModal) {
        IPRangePopupHandler.vm = vm;
        IPRangePopupHandler.$uibModal = $uibModal;
    },
 
    openIPRangeDialog: function (computerIndex) {
        return IPRangePopupHandler.$uibModal.open({
            templateUrl: 'views/settings/dialogs/IPRange.html',
            resolve: { computerIndex: function () { return computerIndex } },
            controller: DialogController,
            backdrop: 'static'
        });

        function DialogController($scope, $uibModalInstance, computerIndex) {
          //===============private===============/
          var _selectedGroup;
          var _returnObjByPromise = { computerFields: {} };
          function init() {
             var IPFromArr, IPToArr, IPRangeArr;
              _selectedGroup = IPMaksPopupHandler.vm.groupMembersHash[IPMaksPopupHandler.vm.selectedGroupId];
              if (computerIndex >= 0) {
                $scope.memberTypeId = _selectedGroup.members[computerIndex].memberTypeId;
                IPRangeArr = _selectedGroup.members[computerIndex].memberDef.split('-', 2);
                IPFromArr = IPRangeArr[0].split('.', 4);
                $scope.IPFrom.part1 = IPFromArr[0];
                $scope.IPFrom.part2 = IPFromArr[1];
                $scope.IPFrom.part3 = IPFromArr[2];
                $scope.IPFrom.part4 = IPFromArr[3];
                IPToArr = IPRangeArr[1].split('.', 4);
                $scope.IPTo.part1 = IPToArr[0];
                $scope.IPTo.part2 = IPToArr[1];
                $scope.IPTo.part3 = IPToArr[2];
                $scope.IPTo.part4 = IPToArr[3];
            }
        }
        //=============Scope Binding=============/  
        $scope.isChange = false;
        $scope.IPFrom = { part1: null, part2: null, part3: null, part4: null }
        $scope.IPTo = { part1: null, part2: null, part3: null, part4: null }
        $scope.add = function () {
            var memeberDef = $scope.IPFrom.part1 + "." + $scope.IPFrom.part2 + "." + $scope.IPFrom.part3 + "." + $scope.IPFrom.part4 + " - "
            + $scope.IPTo.part1 + "." + $scope.IPTo.part2 + "." + $scope.IPTo.part3 + "." + $scope.IPTo.part4;
            _returnObjByPromise.computerFields = {
                "memberTypeId": 3,
                "memberDef": memeberDef,
            }
            _returnObjByPromise.isChange = $scope.isChange;
            $uibModalInstance.close({ computerObject: _returnObjByPromise });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        }
        //========================init========================
        init();
    }
    }
}