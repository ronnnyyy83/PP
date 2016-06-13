var actionHandler = {
    vm: {},
    init : function(vm){
        actionHandler.vm = vm;
    },
    getActionText: function (action) {
        action.scheduleText = null;
        var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (action.scheduleType === 'DayOfWeek' || action.scheduleType === 'DayOfMonth') {
            var days;
            if (action.scheduleType === 'DayOfWeek') {
                days = action.daysOfWeek.toString(2);
            }
            else {
                days = action.daysOfMonth.toString(2);
            }
            var numbers = [];
            days = days.split("").reverse().join("");
            for (var i = 0; i < days.length; i++) {
                if (days[i] === '1') {
                    numbers.push(i);
                }
            }
            action.daysConverted = numbers;
        }

        if (action.scheduleType === 'DayOfWeek') {
            if (numbers.length < 7) {
                action.scheduleText = 'Every ';
                var daysList = [];
                angular.forEach(numbers, function (valueDays, keyDays) {
                    daysList.push(weekDays[valueDays]);
                });
                action.scheduleText += daysList.join(', ');
            }
            else {
                action.scheduleText = 'Every day';
            }
        }
        else if (action.scheduleType === 'DayOfMonth') {
            action.scheduleText = 'On ' + (Number(numbers[0]) + 1) + 'th of each month'
        }
        else if (action.scheduleType === 'SpecificDate') {
            action.dateConverted = moment(action.specificDate).format('L');
            action.scheduleText = 'On ' + action.dateConverted;
        }
        if (action.perform === 'Wake') {
            action.timeConverted = moment(action.fromTime).format('LT');
            action.scheduleText += ' at ' + action.timeConverted;
        }
        else if (action.perform === 'Restart') {
            action.formTimeConverted = moment(action.fromTime).format('LT');
            action.toTimeConverted = moment(action.toTime).format('LT');
            action.scheduleText += ' between ' + action.formTimeConverted + ' and ' + action.toTimeConverted;
        }
        return action.scheduleText;
    },
    setActionItems: function () {        
        angular.forEach(actionHandler.vm.savingPlan.actions, function (value, key) {
            value.actionKey = key;
        });
    }
};

