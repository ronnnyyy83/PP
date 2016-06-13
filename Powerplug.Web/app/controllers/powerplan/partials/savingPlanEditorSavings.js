var savingHandler = {
    vm: {},
    $document: [],
    init: function (vm, $document) {
        savingHandler.vm = vm;
        savingHandler.$document = $document;
        savingHandler.vm.calendarWorkTime = {};
    },
    setSavingItems: function () {
        if (savingHandler.vm.savingPlan.savings && savingHandler.vm.savingPlan.savings.work && savingHandler.vm.savingPlan.savings.work.options) {
            savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted = {};
            angular.forEach(savingHandler.vm.savingPlan.savings.work.options.computerMetrics, function (value, key) {
                savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter] = value;
                savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter].thresholdInKb = savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter].threshold / 1024;
            });
            angular.forEach(savingHandler.vm.savingPlan.savings.work.options.appMetrics, function (value, key) {
                value.appKey = key;
            });

            angular.forEach(savingHandler.vm.savingPlan.savings.work.options.computersNotRun, function (value, key) {
                value.computerKey = key;
            });
        }
        if (savingHandler.vm.savingPlan.savings && savingHandler.vm.savingPlan.savings.nonWork && savingHandler.vm.savingPlan.savings.nonWork.options) {
            savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted = {};
            angular.forEach(savingHandler.vm.savingPlan.savings.nonWork.options.computerMetrics, function (value, key) {
                savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter] = value;
                savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter].thresholdInKb = savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter].threshold / 1024;

            });
            angular.forEach(savingHandler.vm.savingPlan.savings.nonWork.options.appMetrics, function (value, key) {
                value.appKey = key;
            });
            angular.forEach(savingHandler.vm.savingPlan.savings.nonWork.options.computersNotRun, function (value, key) {
                value.computerKey = key;
            });
        }
    },
    updateSavingItems: function () {
        var isContinueAndSave;
        savingHandler.saveWorkTimeCalender();
        if (savingHandler.vm.savingPlan.savings) {
            if (savingHandler.vm.savingPlan.savings.work &&
                savingHandler.vm.savingPlan.savings.work.options &&
                savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted) {
                savingHandler.setComputerMetrics('Cpu', 'work', 1);
                savingHandler.setComputerMetrics('Io', 'work', 1024);
                savingHandler.setComputerMetrics('Network', 'work', 1024);
            }
            if (savingHandler.vm.savingPlan.savings.nonWork &&
                savingHandler.vm.savingPlan.savings.nonWork.options &&
                savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted) {
                savingHandler.setComputerMetrics('Cpu', 'nonWork', 1);
                savingHandler.setComputerMetrics('Io', 'nonWork', 1024);
                savingHandler.setComputerMetrics('Network', 'nonWork', 1024);
            }
            if (!savingHandler.vm.state.current.policyName) {
                alert("Please specify Plan name");
                savingHandler.vm.state.current.toValidateName = true;
                $(window).scrollTop(0);
                return false;
            }
            isContinueAndSave = savingHandler.workNonWorkTimeSave();
            return isContinueAndSave;
        }
    },
    workNonWorkTimeSave: function () {
        var result = true;
        if (savingHandler.vm.savingPlan.savings.nonWork.displalyMinutes == -1) {
            delete savingHandler.vm.savingPlan.savings.nonWork['displalyMinutes'];
        }
        if (savingHandler.vm.savingPlan.savings.work.displalyMinutes == -1) {
            delete savingHandler.vm.savingPlan.savings.work['displalyMinutes'];
        } 
        if (savingHandler.vm.savingPlan.savings.work.computerMinutes == -1) {
            delete savingHandler.vm.savingPlan.savings.work['computerMinutes'];
            delete savingHandler.vm.savingPlan.savings.work['perform'];
        }
        if (savingHandler.vm.savingPlan.savings.nonWork.computerMinutes == -1) {
            delete savingHandler.vm.savingPlan.savings.nonWork['computerMinutes'];
            delete savingHandler.vm.savingPlan.savings.nonWork['perform'];
        }
        if (savingHandler.vm.savingPlan.savings.work.computerMinutes === undefined
            && savingHandler.vm.savingPlan.savings.work.displalyMinutes === undefined
            && savingHandler.vm.savingPlan.savings.nonWork.computerMinutes === undefined
            && savingHandler.vm.savingPlan.savings.nonWork.displalyMinutes === undefined) {
            result = confirm("No Power settings defined. \r\n Are you sure you want to continue?")
        }
        else if (savingHandler.vm.savingPlan.savings.work.computerMinutes === undefined &&
          savingHandler.vm.savingPlan.savings.work.displalyMinutes === undefined) {
            result = confirm("Work Time Power settings have not been defined. \r\n Are you sure you want to continue?")
        }
        else if (savingHandler.vm.savingPlan.savings.nonWork.computerMinutes === undefined &&
          savingHandler.vm.savingPlan.savings.nonWork.displalyMinutes === undefined) {
            result = confirm("Non Work Time Power settings have not been defined. \r\n Are you sure you want to continue?")
        }
        return result;
    },
    saveWorkTimeCalender: function () {
        var workHours = [];
        var startTime;
        var endTime;
        var workTimeMask = [], i = 0; for (; i < 336;) workTimeMask[i++] = 0;
        var day;
        var dayIndex;
        var defaultWorkDay = [{ start: 9, end: 18.3 }]
        var daysIndex = {
            sun: 0,
            mon: 48,
            tue: 96,
            wed: 144,
            thu: 192,
            fri: 240,
            sat: 288
        }
        if (workHoursHandler.vm.savingPlan.workHours.workTimeUseDefault) {
            savingHandler.vm.calendarWorkTime = {
                sun: defaultWorkDay,
                mon: defaultWorkDay,
                tue: defaultWorkDay,
                wed: defaultWorkDay,
                thu: defaultWorkDay,
            }
        }
        for (var dayKey in savingHandler.vm.calendarWorkTime) {
            if (savingHandler.vm.calendarWorkTime.hasOwnProperty(dayKey)) {
                day = savingHandler.vm.calendarWorkTime[dayKey];
                day.forEach(function (timeRange) {
                    startTime = Math.round(timeRange.start * 2) / 2;
                    endTime = Math.round(timeRange.end * 2) / 2;
                    endTime / startTime;
                    for (; startTime < endTime;) {
                        dayIndex = daysIndex[dayKey];
                        workTimeMask[dayIndex + startTime * 2] = 1
                        startTime = startTime + 0.5
                    }
                })
            }
        }
        workHoursHandler.vm.savingPlan.workHours.workTimeMask = workTimeMask.join("");
    },
    setComputerMetrics: function (id, type, multiplyNumber) {
        var chkElement = savingHandler.$document[0].querySelector('#' + type + id);
        var txtElement = savingHandler.$document[0].querySelector('#' + type + id + 'Text');
        var isElementFound = false;
        if (!savingHandler.vm.savingPlan.savings[type].options.computerMetrics) {
            savingHandler.vm.savingPlan.savings[type].options.computerMetrics = [];
        }

        if (chkElement.checked) {
            angular.forEach(savingHandler.vm.savingPlan.savings[type].options.computerMetrics, function (value, key) {
                if (value.counter === id) {
                    isElementFound = true;
                    value.threshold = Number(txtElement.value) * multiplyNumber;
                }
            });

            if (!isElementFound) {
                if (!savingHandler.vm.savingPlan.savings[type].options.computerMetrics) {
                    savingHandler.vm.savingPlan.savings[type].options.computerMetrics = [];
                }
                savingHandler.vm.savingPlan.savings[type].options.computerMetrics.push({ counter: id, threshold: (Number(txtElement.value) * multiplyNumber) });
            }
        }
        else {
            angular.forEach(savingHandler.vm.savingPlan.savings[type].options.computerMetrics, function (value, key) {
                if (value.counter === id) {
                    savingHandler.vm.savingPlan.savings[type].options.computerMetrics.splice(key, 1);
                    savingHandler.vm.savingPlan.savings[type].options.computerMetricsConverted.splice(value.counter, 1);
                }
            });
        }
    }
};



