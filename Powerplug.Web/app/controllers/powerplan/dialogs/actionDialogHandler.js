var actionDialogHandler = {
    vm: {},
    $scope: {},
    changeSpecificDate: function(){ /*Get Overide Later*/ },
    init: function (vm, $scope, $uibModal) {
        actionDialogHandler.vm = vm;
        actionDialogHandler.$scope = $scope;
        actionDialogHandler.$uibModal = $uibModal;
    },

    setActionDialogItems: function () {
        var I;
        if (actionDialogHandler.vm.savingPlan.actions) {
            actionDialogHandler.vm.savingPlan.actions.forEach(function (actionItem, index, array) {
                if (actionItem.options && actionItem.options.computerMetrics) {
                    actionItem.options.computerMetricsConverted = {};
                    angular.forEach(actionItem.options.computerMetrics, function (value, key) {
                        actionItem.options.computerMetricsConverted[value.counter] = value;
                        actionItem.options.computerMetricsConverted[value.counter].thresholdInKb = value.threshold / 1024;
                    });
                    angular.forEach(actionItem.options.appMetrics, function (value, key) {
                        value.appKey = key;
                    });

                    angular.forEach(actionItem.computersNotRun, function (value, key) {
                        value.computerKey = key;
                    });
                }
            });
        }
    },
    GetAction: function(actionType, actionsArray){
        var action, actionKey, options;
        action = {};
        actionKey = actionsArray.length > 0 ? (actionsArray[actionsArray.length - 1].actionKey + 1) : 0;
        action.actionKey = actionKey;
        action.daysConverted = [0, 1, 2, 3, 4, 5, 6];
        action.daysOfMonth = 1;
        action.daysOfWeek = 127;
        action.displayOrder = actionsArray.length;
        action.scheduleType = 'DayOfWeek';
        //actionType specific properties
        action.perform = actionType;
        options = {};
        if (actionType == 'Restart') {
            options.hoursLastBoot = 0;
            options.idleTime = 30;
            options.implicitWake = 10;
            //hours recommendation
            action.fromTime = "1899-12-30T02:00:00";
            action.fromTimeConverted = "2:00 AM";
            action.toTime = "1899-12-30T23:00:00";
            action.toTimeConverted = "11:00 PM"
        }
        else if (actionType == 'Wake') {
            options.keepAlive = 60 ;
            //hours recommendation
            action.timeConverted = "10:00 PM";
            action.fromTime = "1899-12-30T22:00:00";
        }
        action.options = options;

        return action;
    },
    createNewAction: function (actionType, actionsArray) {
        var action, modalInstance;
        action = actionDialogHandler.GetAction(actionType, actionsArray);
        modalInstance = actionDialogHandler.openActionDialog(action, true);
        modalInstance.result.then(function () { actionsArray.push(action) });//, function () {Dismiss});
    },
    openActionDialog: function (actionData, isNewAction) {
       var modal = actionDialogHandler.$uibModal.open({
            templateUrl: 'views/powerplan/dialogs/action.dialog.html',
            resolve: { param: function () {return { 'actionData': actionData, 'isNewAction': isNewAction } } },
            controller: actionDialogHandler.DialogController,
            windowClass: 'action-calendar',
            backdrop: 'static'
        });

       modal.rendered.then(function () {
            //start time  picker 'from date' / 'at date'
            $('.picker-from-date').datetimepicker({
                format: 'LT',
                defaultDate:actionData.fromTime
            });
            //start time  picker 'to date'
            $('.picker-to-date').datetimepicker({
                format: 'LT',
                defaultDate: actionData.toTime
            });

            //start date  picker
            $('.specific-date').datetimepicker({
                format: 'MM/DD/YYYY',
                defaultDate:(typeof actionData.specificDate != 'undefined') ? new Date(actionData.specificDate)    : new Date()
            }).on('dp.change', function (e) {
                actionDialogHandler.changeSpecificDate();
            });
        });

        modal.closed.then(function(){
            //remove date & time picker
            $('.datetimepicker').datetimepicker('remove');
            $('.specific-date').datetimepicker('remove');
        });

        return modal;
    },

    DialogController: function ($scope, $uibModalInstance, param){
        ////===============Private==========================//

        var actionData, isNewAction;
        actionData = param.actionData;
        isNewAction = param.isNewAction;
        var weekDays = actionData.daysOfWeek;
        var SetDayModel = function (newValue) {
            var dayInBit = newValue;
            weekDays = (dayInBit > 0) ? (weekDays | dayInBit) : (weekDays & dayInBit);
            return getDayModel(dayInBit);
        }
        var getDayModel = function (dayInBit) {
            if ((dayInBit & weekDays) == dayInBit) {
                return dayInBit
            } else return ~dayInBit
        }
        function GetSetDays(newValue) {
            if (arguments.length) {
                return SetDayModel(newValue, this.dayInBit);
            } else return getDayModel(this.dayInBit)
        }
        //=================Scope bind====================//
        actionDialogHandler.changeSpecificDate = function(){
            $scope.validateFields()
        };
        $scope.toValidate = false
        $scope.isValide = { error: false, message: "" };
        $scope.validateFields = function () {
            var today = moment(new Date()).format('MM/DD/YYYY');
            var specificDate = actionData.specificDate ? moment(actionData.specificDate).format('MM/DD/YYYY') : null;
            if ($scope.toValidate) {
               if (actionData.scheduleType === 'SpecificDate' && moment(specificDate).isBefore(today)) {
                     $scope.isValide.error = true;
                     $scope.isValide.message = "Specific date and time must be greater then the current date and time"
                     $scope.newAction.specificDate = { $error: { date: true } };
               } else if (actionData.scheduleType === 'DayOfWeek' && (actionData.daysOfWeek == 0)) {
                   $scope.newAction.dayOfweekGroup = { $error: { required: true } };
                   $scope.isValide.error = true;
                   $scope.isValide.message = "Please specify at least one Day of Week"
               } else if (actionData.toTime && moment(actionData.fromTime).isAfter(moment(actionData.toTime))) { //Only in restart
                   $scope.isValide.error = true;
                   $scope.isValide.message =
                       "From time must be at least 15 minutes before To time to ensure enough time for the action to be performed"
                   $scope.newAction.hoursRange = { $error: { range: true } };
               }
               else {
                   $scope.isValide = { error: false, message: "" };
                   if ($scope.newAction.specificDate) {
                       delete $scope.newAction.specificDate.$error['date'];
                   }
                   if ($scope.newAction.dayOfweekGroup) {
                       delete $scope.newAction.dayOfweekGroup.$error['required'];
                   }
                   if ($scope.newAction.hoursRange) {
                       delete $scope.newAction.hoursRange.$error['range'];
                   }
                   return true
               }
               return false;
            }
        }

        $scope.options = actionData.options;
        $scope.perform = actionData.perform;
        $scope.daysOfMonth = actionData.daysOfMonth;
        $scope.checkbox = {};
        $scope.checkbox.keepMonitorOn = actionData.options.keepMonitorOn === undefined ? false : actionData.options.keepMonitorOn;
        $scope.keepAlive     = {num : actionData.options.keepAlive};
        $scope.specificDate = (typeof actionData.specificDate != 'undefined') ? new Date(actionData.specificDate)    : new Date();
        $scope.timeChosen = (typeof actionData.fromTime != 'undefined') ? moment(actionData.fromTime).toDate() : 0;
        $scope.toTime = (typeof actionData.toTime != 'undefined') ? moment(actionData.toTime).toDate() : 0;
        ////modify scheduleType if need
        $scope.scheduleType = actionData.scheduleType;
        if ($scope.scheduleType == 'DayOfWeek' && $scope.scheduleType == 7) {
            $scope.scheduleType = 'EveryDay';
        }
        $scope.Sunday    = { dayInBit: 1, Value: GetSetDays }
        $scope.Monday    = { dayInBit: 2, Value: GetSetDays }
        $scope.Tuesday   = { dayInBit: 4, Value: GetSetDays }
        $scope.Wednesday = { dayInBit: 8, Value: GetSetDays }
        $scope.Thursday  = { dayInBit: 16, Value: GetSetDays }
        $scope.Friday    = { dayInBit: 32, Value: GetSetDays }
        $scope.Saturday  = { dayInBit: 64, Value: GetSetDays }
        $scope.getDaysOfMonthValue = function () {
            if ($scope.daysOfMonth > 31) {
                $scope.daysOfMonth = 31;
            }
            if ($scope.daysOfMonth < 1) {
                $scope.daysOfMonth = 1;
            }
            $scope.$apply;
        }

        $scope.getKeepAliveValue = function () {
            if ($scope.keepAlive.num > 1080) {
                $scope.keepAlive.num = 1080;
            }
            if ($scope.keepAlive.num < 15) {
                $scope.keepAlive.num = 15;
            }
        }
        $scope.cancel = function () { $uibModalInstance.dismiss(); };
        $scope.Add = function () {
            $scope.toValidate = true;
            //get date
            $scope.timeChosen = moment($('#atDate').val(), 'hh:mm A').format();
            $scope.specificDate = moment($('#specific-date').val(), 'MM/DD/YYYY')._d;
            //get date and save
            if ($('#toTime').val()) {
                actionData.toTime = moment($('#toTime').val(), 'hh:mm A').format();
            }
            //Save - add data to json
            actionData.scheduleType = $scope.scheduleType;
            switch (actionData.scheduleType) {
                case 'EveryDay':
                    actionData.scheduleType = 'DayOfWeek';
                    actionData.daysOfWeek = 127;
                    break;
                case 'DayOfWeek':
                    actionData.daysOfWeek = weekDays;
                    break;
                case 'DayOfMonth':
                    actionData.daysOfMonth = $scope.daysOfMonth;
                    break;
                case 'SpecificDate':
                    actionData.specificDate = $scope.specificDate;
                    break;
            }

            actionData.options.keepMonitorOn = $scope.checkbox.keepMonitorOn;
            actionData.options.keepAlive = $scope.keepAlive.num;
            actionData.fromTime = $scope.timeChosen;
            if (!$scope.validateFields()) {
                $('.modal-body').scrollTop(0)
                return;
            }
            actionHandler.getActionText(actionData);
            //brodcast event to directive
            $scope.$broadcast('saveSettings', { actionData: actionData });
            //Hide dialog
            $uibModalInstance.close('Add');
        };
    }
};