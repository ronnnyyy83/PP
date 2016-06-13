var computerGroupPopupHandler = {
    vm: {},
    init: function (vm, $uibModal) {
        computerGroupPopupHandler.vm = vm;
        computerGroupPopupHandler.$uibModal = $uibModal;
    },
 
    openComputerGroupDialog: function (groupIndex) {
        return computerGroupPopupHandler.$uibModal.open({
            templateUrl: 'views/settings/dialogs/computerGroup.html',
            resolve: { groupIndex: function () { return groupIndex } },
            backdrop: 'static',
            controller: DialogController
        });

        function DialogController($scope, $uibModalInstance, groupIndex) {
            //================Private============================
            var _editGroup;
            var _returnObjByPromise = { groupFields: {}}
            function init() {
                $scope.group = { groupName: '', groupDesc: '' }
                if (groupIndex >= 0) {
                    _editGroup = computerGroupPopupHandler.vm.computerGroups[groupIndex];
                    $scope.group.groupName = _editGroup.groupName;
                    $scope.group.groupDesc = _editGroup.groupDesc;
                } 
            }
           //=================scope binding========================
            $scope.isChange = false;
            $scope.closeDialog = function () {
                $uibModalInstance.dismiss();
            };

            $scope.addUpdateGroup = function () {
                _returnObjByPromise.groupFields = {
                    groupName: $scope.group.groupName,
                    groupDesc: $scope.group.groupDesc
                }
                _returnObjByPromise.isChange = $scope.isChange;
                $uibModalInstance.close({ groupObject: _returnObjByPromise });
            }
            //=======================init=========================
            init();
        }
    }
}