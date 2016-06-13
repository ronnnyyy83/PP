var workHoursHandler = {
    vm: {},
    init: function (vm) {
        workHoursHandler.vm = vm;
    },
    setWorkHoursItems: function () {
        var workHours = [];
        var time = 0;
        var active = false;
        var startTime;
        var endTime;
        var currentTime = moment('2012-01-01');
        var workTimeArr = workHoursHandler.vm.savingPlan.workHours.workTimeMask.split('');
        workTimeArr.forEach(function (value, key) {
            if (value === '1') {
                if (!active) {
                    active = true;
                    startTime = currentTime;
                }
                if ( active &&
                    ( Number(moment(currentTime).format("DD")) > Number(moment(startTime).format("DD")) ) ) {
                        active = false;
                        endTime = currentTime;
                        workHours.push({
                            start: startTime,
                            end: endTime
                        });
                        if (workTimeArr[key + 1] === '1') {
                            active = true;
                            startTime = currentTime;
                        }
                } 
            }
            else {
                if (active) {
                    active = false;
                    endTime = currentTime;
                    workHours.push({
                        start: startTime,
                        end: endTime
                    })
                }
            }
            currentTime = moment(currentTime).add(30, 'minutes');
        });
        if (active) {
            endTime = currentTime;
            workHours.push({
                start: startTime,
                end: endTime
            })
        }

        workHoursHandler.vm.workTime = workHours;
        workHoursHandler.vm.performValueChange = function (workType) {
            if (workType == 'nonWork') {
                if (workHoursHandler.vm.savingPlan.savings.nonWork.computerMinutes != -1
                    && workHoursHandler.vm.savingPlan.savings.nonWork.perform === undefined) {
                    workHoursHandler.vm.savingPlan.savings.nonWork.perform = 'Sleep'
                }
            }
            else {
                if (workHoursHandler.vm.savingPlan.savings.work.computerMinutes != -1
                    && workHoursHandler.vm.savingPlan.savings.work.perform === undefined) {
                    workHoursHandler.vm.savingPlan.savings.work.perform = 'Sleep'
                }
            }
        }
        // var myEl = angular.element(document.querySelector('#calendar'));
        // myEl.fullCalendar({
        //     height: 500,
        //     defaultDate: '2012-01-01',
        //     defaultView: 'agendaWeek',
        //     editable: true,
        //     events: workHours,
        //     allDaySlot: false,
        //     header: {
        //         center: '',
        //         left: '',
        //         right: ''
        //     }
        // });
    }
};
