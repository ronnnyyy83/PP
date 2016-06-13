/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ComputerGroupsCtrl',
                     ['$scope', '$uibModal', '$state', 'ComputersResource', 'ComputerGroupsResource', ComputerGroupsCtrl]);

    function ComputerGroupsCtrl($scope, $uibModal, $state, ComputersResource, ComputerGroupsResource) {
        //============Private===========================================
        var vm = this;
        var _maxGroupId = 0;
        var _deletedGroups = [];
        function initGroupMembersHash() {
            //case of unselected group 
            vm.groupMembersHash[-1] = { 'members': [] }
            //init hash object with all computers group ids
            vm.computerGroups.forEach(function (groupItem, index, array) {
                vm.groupMembersHash[groupItem.compGroupId] = {};
                if (_maxGroupId < groupItem.compGroupId) {
                    _maxGroupId = groupItem.compGroupId;
                }
            });
        }
        function initPopups() {
            IPMaksPopupHandler.init(vm, $uibModal);
            computerMaksPopupHandler.init(vm, $uibModal);
            IPRangePopupHandler.init(vm, $uibModal);
            computerGroupPopupHandler.init(vm, $uibModal);
            computersNameDialodHandler.init($uibModal, ComputersResource, ComputerGroupsResource);
            vm.openComputerGroupDialog = function (groupIndex) {
                var modal = computerGroupPopupHandler.openComputerGroupDialog(groupIndex);
                modal.result.then(function (promiseObj) { addUpdateGroup(promiseObj, groupIndex); });
            }
        }
        function isEmpty(object) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            }
        function onError(err) {
                console.log(err)
                if (err.status === 401 || err.status === -1) {
                    $state.go('login');
                }
            }
        function onSuccessGetGroup(data) {
            vm.groupMembersHash[data.compGroupId] = data;
        }
        function onSuccessAllGroups(data) {
            vm.computerGroups = data;
            initGroupMembersHash();
        }
        function updateComputersNameMembers(groupIndex, isInclude) {
            vm.groupMembersHash[groupIndex].members.forEach(function (computerItem, index, array) {
                if (typeof (computerItem.name) !== 'undefined') {
                    computerItem.memberDef = computerItem.name;
                    delete computerItem['name'];
                    computerItem.memberTypeId = 1;
                    computerItem.memberIncExc = isInclude;
                    if (vm.groupMembersHash[groupIndex].status !== 'added') {
                        computerItem.compGroupId = vm.groupMembersHash[groupIndex].compGroupId;
                    }
                }
            });
            if (vm.groupMembersHash[groupIndex].status !== 'added') {
                vm.groupMembersHash[groupIndex].status = 'updated';
            }
        }
        function updateGroupMembers(groupIndex, promise, computerIndex, isInclude) {
            if (!promise.computerObject.isChange) {
                return;
            }
            //if update 
            if (vm.groupMembersHash[groupIndex].status !== 'added') {
                vm.groupMembersHash[groupIndex].status = 'updated';
            }
            //changed existing compute
            if (computerIndex >= 0) {
                for (var field in promise.computerObject.computerFields) {
                    vm.groupMembersHash[groupIndex].members[computerIndex][field] = promise.computerObject.computerFields[field];
                }
                if (vm.groupMembersHash[groupIndex].status !== 'added') {
                    vm.groupMembersHash[groupIndex].members[computerIndex].compGroupId = vm.groupMembersHash[groupIndex].compGroupId;
                }
                vm.groupMembersHash[groupIndex].members[computerIndex].memberIncExc = isInclude;
            } else {
                //added new computer to group
                promise.computerObject.computerFields.memberIncExc = isInclude;
                if (vm.groupMembersHash[groupIndex].status !== 'added') {
                    promise.computerObject.computerFields.compGroupId = vm.groupMembersHash[groupIndex].compGroupId;
                }
                vm.groupMembersHash[groupIndex].members.push(promise.computerObject.computerFields);
            }
        }
        function addUpdateGroup(promiseObj, groupIndex) {
            var hashIndex, newGroup = {};
            if (!promiseObj.groupObject.isChange) {
                return;
            }
            if (groupIndex > 0) {
                hashIndex = vm.computerGroups[groupIndex].compGroupId;
                for (var field in promiseObj.groupObject.groupFields) {
                    vm.computerGroups[groupIndex][field] = promiseObj.groupObject.groupFields[field];
                    vm.groupMembersHash[hashIndex][field] = promiseObj.groupObject.groupFields[field];
                }
                if (vm.groupMembersHash[hashIndex].status !== 'added') {
                    vm.groupMembersHash[hashIndex].status = 'updated';
                }
            }
            else { //new group
                newGroup = promiseObj.groupObject.groupFields;
                _maxGroupId = _maxGroupId + 1;
                newGroup.compGroupId = _maxGroupId;
                vm.computerGroups.push(newGroup);
                vm.groupMembersHash[_maxGroupId] = newGroup;
                vm.groupMembersHash[_maxGroupId].status = 'added';
                vm.groupMembersHash[_maxGroupId].members = [];
            }
        }
        //=======================vm Binding====================================
        vm.selectedGroupIndex = -1;
        vm.selectedGroupId = -1;
        vm.popupType = 'computerName';
        vm.popupTypeOptions = [{ name: 'Computer Name', value: 'computerName' }, { name: 'Computer Mask', value: 'computerMask' },
           { name: 'IP Mask', value: 'IPMask' }, { name: 'IP Range', value: 'IPRange' }];
        vm.groupMembersHash = {};
        vm.incExc = "Include";
        vm.getComputerDefinitionText = function (computerObj) {
            var defenitionText;
            switch (computerObj.memberTypeId) {
                case 2:
                    defenitionText = '[Computer Name] like ' + computerObj.memberDef;
                    break;
                case 3:
                    defenitionText = '[IP Address] in ' + computerObj.memberDef;
                    break;
                case 4:
                    defenitionText = '[IP Address] like ' + computerObj.memberDef;
                    break;
                case 5:
                    defenitionText = '[Computer Name] not like ' + computerObj.memberDef;
                    break;
                case 6:
                    defenitionText = '[IP Address] not like ' + computerObj.memberDef;
                    break;
                default:
                    defenitionText = computerObj.memberDef;
                    break;
            }
            return defenitionText;
        }
        ComputerGroupsResource.groups.query(function (data) { onSuccessAllGroups(data) }, function (error) { onError(error) });
        vm.removeComputer = function (computerObj, index) {
            if (vm.groupMembersHash[vm.selectedGroupId].status !== 'added') {
                vm.groupMembersHash[vm.selectedGroupId].status = 'updated'
            }
            vm.groupMembersHash[vm.selectedGroupId].members.splice(index, 1);
        }
        vm.removeComputerGroup = function (groupObj, index) {
            if (vm.groupMembersHash[groupObj.compGroupId].status !== 'added') {
                _deletedGroups.push(groupObj);
            }
            delete vm.groupMembersHash[groupObj.compGroupId];
            vm.computerGroups.splice(index, 1);
        }
        vm.selectComputerGroup = function ($index) {
            var groupId;
            vm.selectedGroupIndex = $index;
            groupId = typeof (vm.computerGroups[$index].compGroupId) === 'undefined' ? -1 : vm.computerGroups[$index].compGroupId;
            if (groupId > 0 && (isEmpty(vm.groupMembersHash[groupId]))) {
                ComputerGroupsResource.groupMembers.get({ groupId: groupId }, function (data) { onSuccessGetGroup(data) }, function(err){onError(err)});
            }
            vm.selectedGroupId = groupId;
        }
        vm.openAddDialog = function (index) {
            var editPopupType = 0;
            var isInclude, modal;
            isInclude = vm.incExc === "Include" ? 1 : 0;
            if (index >= 0) {
                editPopupType = vm.groupMembersHash[vm.selectedGroupId].members[index].memberTypeId;
            }
            if ('computerName' == vm.popupType && (index < 0)) {
                modal = computersNameDialodHandler.addComputerDialog(vm.groupMembersHash[vm.selectedGroupId].members, false);
                modal.result.then(function () {
                        updateComputersNameMembers(vm.selectedGroupId, isInclude);
                    });
            }
            else if (('computerMask' == vm.popupType) || (editPopupType == 2) || (editPopupType == 5)){
                modal = computerMaksPopupHandler.openComputerMaskDialog(index);
                modal.result.then(function (computerObj) {
                    updateGroupMembers(vm.selectedGroupId, computerObj, index, isInclude);
                });
            }
            else if (('IPMask' == vm.popupType) ||  (editPopupType == 4) || (editPopupType == 6)){
                modal = IPMaksPopupHandler.openIPMaskDialog(index);
                modal.result.then(function (computerObj) {
                    updateGroupMembers(vm.selectedGroupId, computerObj, index, isInclude);
                });
            }
            else if (('IPRange' == vm.popupType) || (editPopupType == 3)) {
                modal = IPRangePopupHandler.openIPRangeDialog(index);
                modal.result.then(function (computerObj) {
                    updateGroupMembers(vm.selectedGroupId, computerObj, index, isInclude);
                });
                }
        };
        vm.saveChanges = function () {
            var returnObj = {};
            var updatedGroups = [];
            var createdGroups = [];
            returnObj.delete = _deletedGroups;
            angular.forEach(vm.groupMembersHash, function (value) {
                if (value.status === 'added') {
                    createdGroups.push(value);
                }
                else if (value.status === 'updated') {
                    updatedGroups.push(value);
                }
            });
            returnObj.create = createdGroups;
            returnObj.update = updatedGroups;
            ComputerGroupsResource.groupMembers.saveAll(returnObj, function (data) {
                alert('Successfully Done!');
                onSuccessGetGroup(data);
                vm.selectedGroupId = -1;
            }, function (err) {
                onError(err);
            });
        }
        vm.discardChanges = function () {
            ComputerGroupsResource.groups.query(function (data) {
                onSuccessAllGroups(data);
                vm.selectedGroupId = -1;
            }, function (error) {
                onError(error);
            });
        }

    //===========init===================//
        initPopups()
}
}());