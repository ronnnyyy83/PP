(function () {
    'use strict';
    angular

        .module('powerPlug')
        .controller('SavingPlanEditorCtrl', ['$state', '$stateParams', '$scope', '$animate', '$document', '$uibModal', 'SavingPlansResource', 'ComputersResource', 'ComputerGroupsResource', 'ScriptsResource', SavingPlanEditorCtrl]);

    function SavingPlanEditorCtrl($state, $stateParams, $scope, $animate, $document, $uibModal, SavingPlansResource, ComputersResource, ComputerGroupsResource, ScriptsResource) {
        var vm = this;
        vm.state = $state;
        vm.policyId = $stateParams.policyId;

        // Check all checkbox in Computers section
        vm.checkAll = function (seed) {
          switch (seed) {
            case 'groups':
            {
              if (vm.selectedAllGroups) {
                  vm.selectedAllGroups = true;
              } else {
                  vm.selectedAllGroups = false;
              }
              angular.forEach(vm.savingPlan.compGroups, function (group) {
                  group.selected = vm.selectedAllGroups;
              });
              break;
            }
            case 'comps':
            {
              if (vm.selectedAllComps) {
                  vm.selectedAllComps = true;
              } else {
                  vm.selectedAllComps = false;
              }
              angular.forEach(vm.savingPlan.computers, function (computer) {
                  computer.selected = vm.selectedAllComps;
              });
              break;
            }
            default:
              console.log('Error. Default value of select all (groups or comps) agr');
          }
        };
        // End check all checkbox in Computers section

        //Scrollbar (Dirty way because of old Jquery)
        if (!$document.mCustomScrollbar) {
            $document.__proto__.mCustomScrollbar = $.mCustomScrollbar;
        }
        vm.config = {
            autoHideScrollbar: false,
            theme: 'light',
            advanced: {
                updateOnContentResize: true
            },
            setHeight: 329,
            scrollInertia: 0
        }

        //End scrollbar

        //Init
        overviewHandler.init(vm, $scope);
        actionDialogHandler.init(vm, $scope, $uibModal);
        eventHandler.init(vm, $scope, $document, $uibModal, ScriptsResource);
        actionHandler.init(vm);
        workHoursHandler.init(vm);
        savingHandler.init(vm, $document);
        computersHandler.init(vm, $scope, $document, $uibModal, ComputersResource, ComputerGroupsResource);
        permissionHandler.init(vm, $scope, $document, $uibModal);

        SavingPlansResource.basic.get({
            policyId: vm.policyId
        }, function (data) {
            onSuccess(data);
        }, function (err) {
            onError(err);
        });

        function doneSaving() {
            alert("succesfully done");
        }
        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function jsonValidation(json) {
            if (json.savings.work.options === undefined) {
                json.savings.work.options = {};
            }
            if (json.savings.nonWork.options === undefined) {
                json.savings.nonWork.options = {};
            }
            if (json.compGroups === undefined) {
                json.compGroups = [];
            }
            if (json.computers === undefined) {
                json.computers = [];
            }
            //Work / Non Work Validation
            if (json.savings.work.displalyMinutes === undefined) {
                json.savings.work.displalyMinutes = -1
            }
            if (json.savings.nonWork.displalyMinutes === undefined) {
                json.savings.nonWork.displalyMinutes = -1
            }
            if (json.savings.work.computerMinutes === undefined) {
                json.savings.work.computerMinutes = -1
            }
            if (json.savings.nonWork.computerMinutes === undefined) {
                json.savings.nonWork.computerMinutes = -1
            }
            //end Work / Non Work Validation
        }

        function onSuccess(data) {
            //title
            data.policyName = (data.policyName || '');
            vm.state.current.policyName = data.policyName;
            vm.state.current.toValidateName = false;
            vm.state.current.title = "Saving Plans > ";            
            vm.state.current.subMenu = true;
            //title
            //console.log(data);
            jsonValidation(data);
            vm.savingPlan = data;
            overviewHandler.setOverviewItems();
            actionHandler.setActionItems();
            actionDialogHandler.setActionDialogItems();
            savingHandler.setSavingItems();
            workHoursHandler.setWorkHoursItems();
            eventHandler.setEventItems();
            computersHandler.setComputerItems();
            overviewHandler.setOverviewGraphs();
            //
            for (var i in vm.savingPlan.actions) {
                vm.getActionText(vm.savingPlan.actions[i]);
            }
        }

        vm.discardChanges = function () {
            SavingPlansResource.basic.get({
                policyId: vm.policyId
            }, function (data) {
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        //Html Elements Events
        vm.isLoading = false;
        vm.saveChanges = function () {
            var isToContinueSave;
            isToContinueSave = savingHandler.updateSavingItems();
            if (!isToContinueSave) {
                return
            }
            vm.isLoading = true;
            computersHandler.prepareComputersDelta();
            computersHandler.prepareComputerGroupsDelta();
            vm.savingPlan.policyName = vm.state.current.policyName;
            if (vm.policyId > 0) {
                vm.savingPlan.$update(function (data) {
                    onSuccess(data);
                    vm.isLoading = false;
                    doneSaving();
                }, function (err) {
                    onError(err);
                });
            } else {
                vm.savingPlan.$save({
                    policyId: null
                }, function (data) {
                    onSuccess(data)
                    vm.isLoading = false;
                    doneSaving();
                    $state.go('savingPlanEditor', { policyId: data.policyId }, { reload: true });
                }, function (err) {
                    onError(err);
                });
            }
        }

        //dialog
        vm.addEventScripts = eventHandler.eventScriptDialog;
        vm.showAdvanced = actionDialogHandler.showAdvanced;
        vm.showAddComputers = computersHandler.addComputerDialog;
        vm.showAddComputerGroups = computersHandler.addComputerGroupsDialog;
        //events
        vm.showEventScripts = eventHandler.showEventScripts;
        vm.removeEventScript = eventHandler.removeEventScript;
        vm.removeComputerGroups = computersHandler.removeComputerGroups;
        vm.removeComputerGroupById = computersHandler.removeComputerGroupById;
        vm.removeComputers = computersHandler.removeComputers;
        vm.removeComputerByName = computersHandler.removeComputerByName;
        //actions
        vm.getActionText = actionHandler.getActionText
            //dialog
        vm.openActionDialog = actionDialogHandler.openActionDialog;
        vm.createNewAction = actionDialogHandler.createNewAction;
        vm.addPermissions = permissionHandler.addPermissionsDialog;
        setTimeout(function(){
            $(".scroll").click(function(event) {
                event.preventDefault();
                $('html,body').animate( { scrollTop:$(this.hash).offset().top } , 500);
            } );
        },0);
    }
}());
