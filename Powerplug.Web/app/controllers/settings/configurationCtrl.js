/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ConfigurationCtrl',
                     ['$state', '$document', '$uibModal', '$scope', 'ConfigurationResource', ConfigurationCtrl]);


    function ConfigurationCtrl($state, $document, $uibModal, $scope, ConfigurationResource) {
        var vm = this;
        var workHours;
        ConfigurationResource.get(function (data) {
            onSuccess(data);
        }, function (error) {
            onError(error);
        });
        function getDefualtWorkTime(calendarWorkTime) {
            var startTime;
            var endTime;
            var workTimeMask = [], i = 0; for (; i < 336;) workTimeMask[i++] = 0;
            var day;
            var dayIndex;
            var daysIndex = {
                sun: 0,
                mon: 48,
                tue: 96,
                wed: 144,
                thu: 192,
                fri: 240,
                sat: 288
            }
          
            for (var dayKey in calendarWorkTime) {
                if (calendarWorkTime.hasOwnProperty(dayKey)) {
                    day = calendarWorkTime[dayKey];
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
            vm.system.defWorkTime = workTimeMask.join("");
            getHoursList();
        }
        function getHoursList() {
            var time = 0;
            var active = false;
            var startTime;
            var endTime;
            var currentTime = moment('2012-01-01');
            var workTimeArr = vm.system.defWorkTime.split('');
            workHours = [];
            workTimeArr.forEach(function (value, key) {
                if (value === '1') {
                    if (!active) {
                        active = true;
                        startTime = currentTime;
                    }
                    if (active &&
                        (Number(moment(currentTime).format("DD")) > Number(moment(startTime).format("DD")))) {
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

            createDefaultDateText();
            
        }
        function onError(err) {
            console.log(err);
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function createDefaultDateText() {
            var days = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
            var dayTimes = {};
            for (var i = 0; i < workHours.length; i++) {
                if (!dayTimes[workHours[i].start.format('dddd')]) {
                    dayTimes[workHours[i].start.format('dddd')] = { 'timeText' : '',  'arrText' : []};
                }

                var text = workHours[i].start.format('LT') + ' to ' + workHours[i].end.format('LT');
                dayTimes[workHours[i].start.format('dddd')].arrText.push({ 'text': text });
            }

            for (var index in dayTimes) {
                var times = [];
                for (var i = 0; i < dayTimes[index].arrText.length; i++) {
                    times.push(dayTimes[index].arrText[i].text);
                }
                dayTimes[index].timeText = times.join(', ');
                
            };

            var daysCompare = {};
            for (var index in dayTimes) {
                var timeText = dayTimes[index].timeText;
                if (!daysCompare[timeText]) {
                    daysCompare[timeText] = [];
                }

                daysCompare[timeText].push(index);

            };

            var workTimeArr = [];
            for (var timeText in daysCompare) {

                var dayText = '';
                var lastDay = -1;
                var isContinued = false;
                var lastDayName = '';
                for (var i = 0; i < daysCompare[timeText].length; i++) {
                    var dayName = daysCompare[timeText][i];
                    if (i == 0) {
                        dayText = dayName.substring(0, 3);
                    }
                    else if (lastDay === (days[dayName] - 1)) {
                        if (!isContinued) {
                            dayText += '-';
                            isContinued = true;
                        }
                    }
                    else if (isContinued) {
                        isContinued = false;
                        dayText += lastDayName.substring(0, 3);
                        dayText += ', ' + dayName.substring(0, 3);
                    }
                    else {
                        dayText += ', ' + dayName.substring(0, 3);
                    }
                    lastDay = days[dayName];
                    lastDayName = dayName;
                }
                if (isContinued) {
                    dayText += lastDayName.substring(0, 3);
                }

                workTimeArr.push(dayText + ' ' + timeText);

            };

            vm.defaultWorkTimeText = workTimeArr.join('; ');
        }

        var cosnt = {
            LOCALE_SYS_DEF: '0',
            LOCALE_STR_ENGLISH_US: '0409',
            LOCALE_STR_HEBREW: '040D',
            LOCALE_STR_ITALIAN_ITALY: '0410',
            LOCALE_STR_FRENCH_FRANCE: '040C',
            LOCALE_STR_SPANISH_SPAIN: '0C0A',
            LOCALE_STR_GERMAN_GERMANY: '0407',
            LOCALE_STR_RUSSIAN_RUSSIA: '0419',
            LOCALE_STR_CHINESE_CHINA: '0804'
        }
        
        vm.displayUnit = [
             { name: "Metric", id: "Metric" },
            { name: "US", id: "US" }
        ]
        vm.language = [
            { name: "Use System Local", id: cosnt.LOCALE_SYS_DEF },
            { name: "US English", id: cosnt.LOCALE_STR_ENGLISH_US },
            { name: "Hebrew", id: cosnt.LOCALE_STR_HEBREW },
            { name: "Italian", id: cosnt.LOCALE_STR_ITALIAN_ITALY },
            { name: "French", id: cosnt.LOCALE_STR_FRENCH_FRANCE },
            { name: "Spanish", id: cosnt.LOCALE_STR_SPANISH_SPAIN },
            { name: "German", id: cosnt.LOCALE_STR_GERMAN_GERMANY },
            { name: "Russian", id: cosnt.LOCALE_STR_RUSSIAN_RUSSIA },
            { name: "Chinese", id: cosnt.LOCALE_STR_CHINESE_CHINA }
        ]
        function onSuccess(data) {
            vm.configurationObj = data;
            vm.agent = data.configutationAgent;
            vm.console = data.configutationConsole;
            vm.general = data.configutationGeneral;
            vm.system = data.configutationSystem;
            getHoursList();
            calculateValuesAgent();
            $scope.checkbox = {};
            $scope.checkbox.displayTrayIcon = vm.agent.displayTrayIcon;

        }
        function updateAgentValues() {
            vm.agent.chkForUpdateSec = vm.agent.chkForUpdateSec * 60
            vm.agent.hardwareInventoryScanHours = vm.agent.hardwareInventoryScanHours * 24
            vm.agent.uploadDataIntervalSec = vm.agent.uploadDataIntervalSec * (60 * 60)
        }
        function calculateValuesAgent() {
            vm.agent.chkForUpdateSec = vm.agent.chkForUpdateSec / 60
            vm.agent.hardwareInventoryScanHours = vm.agent.hardwareInventoryScanHours / 24
            vm.agent.uploadDataIntervalSec = vm.agent.uploadDataIntervalSec / (60 * 60)
        }

        vm.saveChanges = function () {
            updateAgentValues();
            vm.configurationObj.$update(function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        vm.openDefualtWorkHoursDialog = function ($scope, $uibModalInstance) {
            var modal = $uibModal.open({
                templateUrl: 'views/settings/dialogs/setDefaultWorkTime.html',
                //resolve: { defaultTime: function () { return vm.system.defaultTime } },
                controller: DialogController,
                windowClass: 'action-calendar',
                backdrop: 'static'
            });
            modal.result.then(function (calendarWorkTime) {
                getDefualtWorkTime(calendarWorkTime);
            });

            function DialogController($scope, $uibModalInstance) {
                $scope.workHours = workHours;
                $scope.calendarWorkTime = {};
                $scope.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                $scope.add = function () {
                    $uibModalInstance.close($scope.calendarWorkTime);
                };
            }
        }
        vm.discardChanges = function () {

            ConfigurationResource.get(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }

    }
}());