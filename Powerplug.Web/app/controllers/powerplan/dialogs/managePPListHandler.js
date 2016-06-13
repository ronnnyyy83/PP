var managePPListHandler = (function() {
    //===============================private=================================

    var _vm, _uibModal, _sortableArr;
    function convertJsonToSortablePPList(PPItem) {
        var sortableItem;
        sortableItem = {};
        sortableItem.policyName = PPItem.policyName
        sortableItem.policyId = PPItem.policyId;
        sortableItem.listOrder = PPItem.listOrder;
        sortableItem.checked = 0;
        sortableItem.deleted = false;
        return sortableItem;
    }

    function initSortableArray() {
        _sortableArr = [];
        _vm.savingPlans.forEach(function (item, index, array) {
            _sortableArr.push(convertJsonToSortablePPList(item));
        });
        _sortableArr.sort(function (a, b) { return b.listOrder - a.listOrder })
    }
    function DialogController(param, $scope, $uibModalInstance) {
        
        var PPItem;
        _deletedArr = [];
        var sortListOrder = function () {
            var len = $scope.PParray.length, i, j, stop, tempListOrder;
            for (var i = (len - 1) ; i >= 0; i--) {
                for (var j = (len - i - 1) ; j > 0; j--) {
                    if ($scope.PParray[j].listOrder > $scope.PParray[j - 1].listOrder) {
                        tempListOrder = $scope.PParray[j].listOrder;
                        $scope.PParray[j].listOrder = $scope.PParray[j - 1].listOrder;
                        $scope.PParray[j - 1].listOrder = tempListOrder;
                    }
                }
            }
        }

        $scope.checkAll = function () {
            if ($scope.selectedAll) {
                $scope.selectedAll = true;
            } else {
                $scope.selectedAll = false;
            }
            angular.forEach($scope.PParray, function (PParrayItem) {
                PParrayItem.checked = $scope.selectedAll;
            });
        }

        $scope.sortableOptions = {}
        $scope.PParray = param.PParray;
        $scope.sortingLog = [];
        $scope.deletePolicies = function(){
            var i = $scope.PParray.length;
            while (i--) {
                PPItem = $scope.PParray[i];
                if (PPItem.checked) {
                    $scope.PParray.splice(i, 1);
                    PPItem.deleted = true;
                    _deletedArr.push(PPItem);
                }
            }      
        }
        $scope.cancel = function () { $uibModalInstance.dismiss(); };
        $scope.Add = function () {
            sortListOrder();
            $uibModalInstance.close('applay');
            _savingPlansResource.priority.saveAll(_deletedArr.concat($scope.PParray), function (data) {
                _vm.savingPlans = data;
                _vm.sortListOrder();
            });
        };
    }

    //=================================public================================
    var api = {};
    api.init = function (viewModal, $uibModal, SavingPlansResource) {
        _vm = viewModal;
        _uibModal = $uibModal;
        _savingPlansResource = SavingPlansResource;
    };

    api.openManageDialog = function () {
        initSortableArray();
        return _uibModal.open({
            templateUrl: 'views/powerplan/dialogs/managePPList.html',
            resolve: { param: function () { return { 'PParray': _sortableArr } } },
            backdrop: 'static',
            controller: DialogController
        });
    };
    return api;
}());