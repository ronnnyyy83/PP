
var eventHandler = {
    vm: {},
    $scope: {},
    $document: [],
    $uibModal: {},
    ScriptsResource: {},
    init: function (vm, $scope, $document, $uibModal, ScriptsResource) {
        eventHandler.vm = vm;
        eventHandler.$scope = $scope;
        eventHandler.$document = $document;
        eventHandler.$uibModal = $uibModal;
        eventHandler.ScriptsResource = ScriptsResource;
    },
    setEventItems: function () {
        eventHandler.vm.currentEventScripts = [];
        eventHandler.vm.showEventScripts(1);
    },
    eventScriptDialog: function (ev) {
        eventHandler.$uibModal.open({
            templateUrl: 'views/powerplan/dialogs/addScript.html',
            controller: DialogController,
            backdrop: 'static',
            size:'large'
        });
       
        function DialogController($scope, $uibModalInstance) {
            $scope.context = 'System';
            function onError(err) {
                console.log(err)
                if (err.status === 401 || err.status === -1) {
                    $state.go('login');
                }
            }
            eventHandler.ScriptsResource.basic.query(function (data) {
                $scope.eventScripts = data;
            }, function (err) {
                onError(err);
            });

            $scope.addEventScripts = function () {
                var length = 0;
                var isEventFound = false;
                angular.forEach(eventHandler.vm.savingPlan.events, function (valueEvent, keyEvent) {
                    if (eventHandler.vm.currentEvent === valueEvent.eventType) {
                        isEventFound = true;
                        fillScripts(keyEvent);
                    }
                });
                if (isEventFound === false) {
                    if (!eventHandler.vm.savingPlan.events) {
                        eventHandler.vm.savingPlan.events = [];
                    }
                    length = eventHandler.vm.savingPlan.events.push({
                        eventType: eventHandler.vm.currentEvent,
                        scripts: []
                    });
                    fillScripts(length - 1);
                }

                function fillScripts(keyEvent) {
                    angular.forEach(angular.element('.script-selection:checked'), function (value, key) {
                        var newScriptId = Number(value.getAttribute('data-script-id'));
                        var newScriptName = value.getAttribute('data-name');
                        var newScriptGUID = value.getAttribute('data-guid');                        
                        var isExist = false;

                        angular.forEach(eventHandler.vm.savingPlan.events[keyEvent].scripts, function (valueContainer, keyContainer) {
                            if (valueContainer.scriptId === newScriptId) {
                                isExist = true;
                            }
                        });

                        if (!isExist) {
                            eventHandler.vm.savingPlan.events[keyEvent].scripts.push({
                                context: $scope.context,
                                scriptGUID: newScriptGUID,
                                scriptName: newScriptName,
                                scriptId: newScriptId
                            });
                        }
                    });

                    eventHandler.vm.currentEventScripts = eventHandler.vm.savingPlan.events[keyEvent].scripts;
                }

                $uibModalInstance.close();
            };

            $scope.closeEventScripts = function () {
                $uibModalInstance.dismiss();
            };

            // Select all checkboxes function in add script dialog
            $scope.checkAll = function (seed) {
                switch (seed) {
                case 'scripts':
                    {
                        if ($scope.selectedAllScripts) {
                            $scope.selectedAllScripts = true;
                        } else {
                            $scope.selectedAllScripts = false;
                        }
                        angular.forEach($scope.eventScripts, function (script) {
                            script.selected = $scope.selectedAllScripts;
                        });
                        break;
                    }
                default:
                    console.log('Error. Default value of select all (groups or comps) agr');
                }
            }

            // End select all checkboxes function in add script dialog
        }
    },
    showEventScripts: function (eventType) {
        eventHandler.vm.currentEventScripts = [];
        eventHandler.vm.currentEvent = eventType;
        if (eventHandler.vm.savingPlan.events) {
            angular.forEach(eventHandler.vm.savingPlan.events, function (value, key) {
                if (value.eventType === eventType) {
                    eventHandler.vm.currentEventScripts = value.scripts;
                }
            });
        }
    },
    removeEventScript: function (scriptId) {
        angular.forEach(eventHandler.vm.savingPlan.events, function (value, key) {
            if (eventHandler.vm.currentEvent === value.eventType) {
                angular.forEach(eventHandler.vm.savingPlan.events[key].scripts, function (valueScript, keyScript) {
                    if (scriptId === valueScript.scriptId) {
                        eventHandler.vm.savingPlan.events[key].scripts.splice(keyScript, 1);
                    }
                });
            }
        });
    }
};
