var overviewHandler = {
    vm: {},
    scope: {},
    init: function (vm, scope) {
        overviewHandler.vm = vm;
        overviewHandler.scope = scope;
    },
    setOverviewItems: function () {
        var forceLocal 
        if (typeof ($('.from-date').data("DateTimePicker")) != typeof undefined) {
            forceLocal = new Date(overviewHandler.vm.savingPlan.validFrom);
            forceLocal.setMinutes(forceLocal.getTimezoneOffset())
            $('.from-date').data("DateTimePicker").date(forceLocal);
        }
        if (typeof ($('.to-date').data("DateTimePicker")) != typeof undefined) {
            forceLocal = new Date(overviewHandler.vm.savingPlan.validTo);
            forceLocal.setMinutes(forceLocal.getTimezoneOffset())
            $('.to-date').data("DateTimePicker").date(forceLocal);
        }
    },
    setOverviewGraphs: function () {
        overviewHandler.vm.events=[
          {
            type:"Wakeup",
            title: "Scheduled Wake Up",
            text: 'On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'sun',
            start: 17.3
          },
          {
            type:"Wakeup",
            title: "Weekly Wake Up1",
            text: 'Every Sunday On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'mon',
            start: 17.3
          },
          {
            type:"Restart",
            title: "Weekly Wake Up2",
            text: 'Every Sunday On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'thu',
            start: 18
          },
          {
            type:"Restart",
            title: "Weekly Wake Up3",
            text: 'Every Sunday On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'fri',
            start: 18
          }
        ];

        overviewHandler.vm.workTimeChange = function(workTimeList){
        }

        overviewHandler.vm.actionRemove = function (actionKey) {
            for (var day in savingHandler.eventsTimePos) {
                for (var action in savingHandler.eventsTimePos[day]) {
                    if (savingHandler.eventsTimePos[day][action].actionKey == actionKey) {
                        savingHandler.eventsTimePos[day].splice(action, 1);
                    }
                }
            }
        }

        overviewHandler.vm.actionEdit = function(action){
          var index = _.findIndex(overviewHandler.vm.savingPlan.actions,{actionKey:action});
          overviewHandler.vm.openActionDialog(overviewHandler.vm.savingPlan.actions[index],false);
        }

        varWorkDaysGraphArr = [];
        if (overviewHandler.vm.savingPlan.workDaysData) {
            angular.forEach(overviewHandler.vm.savingPlan.workDaysData, function (value, key) {
                var serieObj = {};
                serieObj.name = value.seriesName;
                serieObj.data = value.data;
                if (value.seriesName === 'Work Time') {
                    serieObj.color = "#8ec536";
                }
                else if (value.seriesName === 'Down Time') {
                    serieObj.color = "#bf2b29";
                }
                else if (value.seriesName === 'Idle Time') {
                    serieObj.color = "#28aadc";
                }
                varWorkDaysGraphArr.push(serieObj);
            });
        }

        overviewHandler.vm.workDaysGraph = varWorkDaysGraphArr;

        varNonWorkDaysGraphArr = [];
        if (overviewHandler.vm.savingPlan.nonWorkDaysData) {
            angular.forEach(overviewHandler.vm.savingPlan.nonWorkDaysData, function (value, key) {
                var serieObj = {};
                serieObj.name = value.seriesName;
                serieObj.data = value.data;
                if (value.seriesName === 'Work Time') {
                    serieObj.color = "#8ec536";
                }
                else if (value.seriesName === 'Down Time') {
                    serieObj.color = "#bf2b29";
                }
                else if (value.seriesName === 'Idle Time') {
                    serieObj.color = "#28aadc";
                }
                varNonWorkDaysGraphArr.push(serieObj);
            });
        }

        overviewHandler.vm.nonWorkDaysGraph = varNonWorkDaysGraphArr;
        //==================Date Pickers==================
        $('.from-date').datetimepicker({
            format: 'MM/DD/YYYY',
            defaultDate: overviewHandler.vm.savingPlan.validFrom
        });
        $('.from-date').on("dp.change", function (e) {
            overviewHandler.vm.savingPlan.validFrom = moment($('#from-date').val(), 'MM/DD/YYYY')._d
        });
        $('.to-date').datetimepicker({
            format: 'MM/DD/YYYY',
            defaultDate: overviewHandler.vm.savingPlan.validTo
        });
        $('.to-date').on("dp.change", function (e) {
            overviewHandler.vm.savingPlan.validTo = moment($('#to-date').val(), 'MM/DD/YYYY')._d
        });
   
        //==============End Date Pickers================
        overviewHandler.vm.text = "";

        overviewHandler.vm.done = function (data2) {
        };

        overviewHandler.vm.preview = function (data1) {
        };

        overviewHandler.vm.summary = [];
        setSummaryTexts();
        function setSummaryTexts(){
            overviewHandler.vm.summary = [];
            if (overviewHandler.vm.savingPlan.savings.work.perform && overviewHandler.vm.savingPlan.savings.work.computerMinutes > -1) {
                overviewHandler.vm.summary.push({
                    type: 'computerSaving',
                    time: 'work',
                    text: getComputerTimeText(overviewHandler.vm.savingPlan.savings.work.perform, overviewHandler.vm.savingPlan.savings.work.computerMinutes)
                });
            }
            if (overviewHandler.vm.savingPlan.savings.nonWork.perform && overviewHandler.vm.savingPlan.savings.nonWork.computerMinutes > -1) {
                overviewHandler.vm.summary.push({
                    type: 'computerSaving',
                    time: 'nonWork',
                    text: getComputerTimeText(overviewHandler.vm.savingPlan.savings.nonWork.perform, overviewHandler.vm.savingPlan.savings.nonWork.computerMinutes)
                });
            }
            if (overviewHandler.vm.savingPlan.savings.work.displalyMinutes > -1) {
                overviewHandler.vm.summary.push({
                    type: 'displaySaving',
                    time: 'work',
                    text: getMonitorTimeText(overviewHandler.vm.savingPlan.savings.work.displalyMinutes)
                });
            }
            if (overviewHandler.vm.savingPlan.savings.nonWork.displalyMinutes > -1) {
                overviewHandler.vm.summary.push({
                    type: 'displaySaving',
                    time: 'nonWork',
                    text: getMonitorTimeText(overviewHandler.vm.savingPlan.savings.nonWork.displalyMinutes)
                });
            }
        }
        
        function getComputerTimeText(perform, time) {
            if (time === 0) {
                return 'Computer stays ON';
            }
            else if (time === 1) {
                return 'Perform ' + perform + ' after 1 minute';
            }
            else if (time < 60) {
                return 'Perform ' + perform + ' after ' + time + ' minutes';
            }
            else if (time === 60) {
                return 'Perform ' + perform + ' after 1 hour';
            }
            else if (time > 60) {
                return 'Perform ' + perform + ' after ' + (time / 60) + ' hours';
            }
        }

        function getMonitorTimeText(time) {
            if (time === 0) {
                return 'Monitor stays ON';
            }
            else if (time === 1) {
                return 'Monitor off after ' + time + ' after 1 minute of inactivity';
            }
            else if (time < 60) {
                return 'Monitor off after ' + time + ' minutes of inactivity';
            }
            else if (time === 60) {
                return 'Monitor off after ' + time + ' after 1 hour of inactivity';
            }
            else if (time > 60) {
                return 'Monitor off after ' + (time / 60) + ' hours of inactivity';
            }
        }

        overviewHandler.vm.setSummaryText = function(){
            setSummaryTexts();
        }
    }
}
