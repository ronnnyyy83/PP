/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ConsolePermissionCtrl',
                     ['$state', '$document', '$uibModal', '$scope', 'ConsolePermissionResource', ConsolePermissionCtrl]);


    function ConsolePermissionCtrl($state, $document, $uibModal, $scope, ConsolePermissionResource) {
        var vm = this;        
        var deletedUsers = [];
        vm.selectedPermObj = {};

        function getPermissionData() {
            ConsolePermissionResource.usersAndGrops.query(function (data) {
                onSuccessGroupsAndUsers(data);
            }, function (error) {
                onError(error);
            });
            ConsolePermissionResource.roles.query(function (data) {
                onSuccessRoles(data);
            }, function (error) {
                onError(error);
            });
        }
        function init() {
            getPermissionData();
            addUserPopupHandler.init($uibModal);
        }
        function onError(err) {
            console.log(err);
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function onSuccessGroupsAndUsers(data) {
            //validity check
            for (var i = data.length - 1 ; i >= 0 ;i--) {
                if (data[i].permObjTypeId == 3) { //permission is for a group
                    data.splice(i, 1);
                }
            }
            vm.users = data;
        }
        function onSuccessRoles(data) {
            vm.roles = data;
            vm.roles.forEach(function (role) {
                role.selected = false;
            });

        }
        vm.selectedRole = { description: 'Please click on a role to view its description' , index: -1};
        vm.selectedPermObj = null;
        vm.selectedIndex = -1;
        vm.updatePermObj = function (role) {
            if (!vm.selectedPermObj) {
                role.selected = false;
                return;
            }
            //change status
            if (vm.selectedPermObj.status !== 'added') {
                vm.selectedPermObj.status = 'updated';
            }
            if (role.selected) {
                //Add role to permObj
                vm.selectedPermObj.roles.push({ permGrpId: role.permGrpId, permObjectId: vm.selectedPermObj.permObjectId });
            } else {
                //Remove role to permObj
                for (var i = vm.selectedPermObj.roles.length - 1 ; i >= 0 ;i--) {
                    if (vm.selectedPermObj.roles[i].permGrpId === role.permGrpId) {
                        vm.selectedPermObj.roles.splice(i, 1);
                        break;
                    }
                }
            }
        }
        vm.showRoleDescription = function(description, index){
            vm.selectedRole = { description: description, index: index };
        }
        vm.selectPermObj = function (permObj, index) {
            vm.selectedPermObj = permObj;
            vm.selectedIndex = index
            //unselect all 
            vm.roles.forEach(function (role) {
                role.selected = false;
            })
            //select all chosen roles
            permObj.roles.forEach(function (permRole) {
                vm.roles.forEach(function (role) {
                    if (permRole.permGrpId === role.permGrpId) {
                        role.selected = true;
                    }
                });
            })
        }
        vm.checkAll = function (seed) {
            if (vm.selectedAll) {
                vm.selectedAll = true;
            } else {
                vm.selectedAll = false;
            }
            vm.users.forEach(function (user) {
                user.selected = vm.selectedAll;
            });
        }
        vm.deleteChosenUsers = function () {
            for (var i = vm.users.length - 1 ; i >= 0 ; i--) {
                if (vm.users[i].selected == true) {
                    if (vm.users[i].status != 'added') {
                        deletedUsers.push(vm.users[i]);
                    }
                    vm.users.splice(i, 1);
                }
            }
        }
        vm.saveChanges = function () {
            var returnObj = {};
            var updatedUsers = [];
            var createdUsers = [];
            returnObj.delete = deletedUsers;
            vm.users.forEach( function (value) {
                if (value.status === 'added') {
                    createdUsers.push(value);
                }
                else if (value.status === 'updated') {
                    updatedUsers.push(value);
                }
            });
            returnObj.create = createdUsers;
            returnObj.update = updatedUsers;
            ConsolePermissionResource.usersAndGrops.saveAll(returnObj, function (data) {
                alert('Successfully Done!');
                onSuccessGroupsAndUsers(data);
            }, function (err) {
                onError(err);
            });
        }
        vm.discardChanges = function () {
            vm.selectedIndex = -1;
            getPermissionData();
        }
        vm.openAddUserDialog = function () {
            var modal = addUserPopupHandler.openDialog();
            modal.result.then(function (newUserData) {
                var newUser = {};
                newUser.password = newUserData.password;
                newUser.permObjDesc = newUserData.userName;
                newUser.permObject = newUserData.userName;
                newUser.permObjTypeId = 2;
                newUser.permissions = 0;
                newUser.roles = [];
                newUser.status = 'added';
                vm.users.push(newUser);
            });
        };
        //================init=====================
        init();

    }
}());