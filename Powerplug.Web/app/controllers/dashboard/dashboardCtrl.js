/// <reference

(function () {
    'use strict';

    angular
        .module('powerPlug')
        .controller('DashboardCtrl', ['$state', 'StatisticsResource', 'EnergyUsageResource', 'DevicesResource', 'PowerPlansResource',
            'ActiveComputersGraphResource', 'PowerConsumptionGraphResource', 'OtherSavingGraphResource', 'ActivityAnalysisGraphResource', DashboardCtrl]);


    function DashboardCtrl($state, StatisticsResource, EnergyUsageResource, DevicesResource, PowerPlansResource, ActiveComputersGraphResource, PowerConsumptionGraphResource, OtherSavingGraphResource, ActivityAnalysisGraphResource) {
        var vm = this;
        vm.Math = window.Math;
        vm.statisticPeriod = '1';
        vm.energyUsagePeriod = '1';
        vm.graphType = 'AC';
        vm.graphPeriod = '1';
        
        function getStatisticPeriod() {
            StatisticsResource.get({
                from: vm.statisticPeriod
            }, function (data) {
                onStatisticSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        function getDevicePeriod() {
            DevicesResource.get(function (data) {
                onDeviceSuccess(data);
            }, function (err) {
                onError(err);
            });            
        }

        function getEnergyUsagePeriod() {
            EnergyUsageResource.get({
                from: vm.energyUsagePeriod
            }, function (data) {
                onEnergyUsageSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        function getPowerPlanPeriod() {
            PowerPlansResource.get(function (data) {
                onPowerPlansSuccess(data);
            }, function (err) {
                onError(err);
            });            
        }

        function getGrapsPeriod() {
            if (vm.graphType === 'AC') {
                ActiveComputersGraphResource.get({
                    from: vm.graphPeriod
                }, function (data) {
                    onActiveComputersSuccess(data);
                }, function (err) {
                    onError(err);
                });
            }
            else if (vm.graphType === 'PC') {
                PowerConsumptionGraphResource.get({
                    from: vm.graphPeriod
                }, function (data) {
                    onPowerConsumptionSuccess(data);
                }, function (err) {
                    onError(err);
                });                
            }
            else if (vm.graphType === 'PS') {
                OtherSavingGraphResource.get({
                    from: vm.graphPeriod
                }, function (data) {
                    onPowerSavingSuccess(data);
                }, function (err) {
                    onError(err);
                });                
            }
            else if (vm.graphType === 'CA') {
                ActivityAnalysisGraphResource.get({
                    from: vm.graphPeriod
                }, function (data) {
                    onActivityAnalysisSuccess(data);
                }, function (err) {
                    onError(err);
                });                
            }
        }

        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function roundDecimals(num) {
            return parseFloat(Math.round(num * 100) / 100).toFixed(2);
        }

        function getDateShortText(dtText) {
            var dt = moment(dtText);
            var retDate = dt.format('MM/DD');
            if (vm.graphPeriod > 4) {
                retDate = dt.format('MM/YY');
            }
            return retDate;
        }

        function getDateLongText(dtText) {
            var dt = moment(dtText);
            var retDate = dt.format('MM/DD/YYYY');
            if (vm.graphPeriod > 4) {
                retDate = dt.format('MM/YYYY');
            }
            return retDate;
        }
    
        function onActiveComputersSuccess(data) {            
            var dates = [];
            var computers = [];
            for (var i = 0; i < data.graphData.length; i++) {
                dates.push(data.graphData[i].sumDate);
                computers.push(data.graphData[i].computers);
            }
            
            vm.highchartsActiveComputersNG = {
                options: {
                    chart: {
                        type: 'area',
                        height: 220
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            fillColor: '#f2f2f2',
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    xAxis: {
                        categories: dates,
                        labels: {                            
                            formatter: function () {
                                return getDateShortText(this.value);
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '',
                        pointFormatter: function () {
                            return getDateLongText(this.category) + '<br/><b>' + this.y + '</b> computers';
                        }
                    },
                },
                series: [{
                    name: '',
                    color: '#8cc63f',
                    data: computers
                }],
                title: {
                    text: ''
                }
            }
        }
        
        function onPowerConsumptionSuccess(data) {
            console.log(data);
            var dates = [];
            var powerConsumed = [];
            var totalPowerSavedOther = [];            
            for (var i = 0; i < data.graphData.length; i++) {
                dates.push(data.graphData[i].sumDate);
                powerConsumed.push(data.graphData[i].powerConsumed);
                totalPowerSavedOther.push(data.graphData[i].totalPowerSavedOther);
            }

            vm.highchartsPowerConsumptionNG = {
                options: {
                    chart: {
                        type: 'area',
                        height: 220
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            stacking: 'normal',
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    xAxis: {
                        categories : dates,
                        labels: {
                            formatter: function () {
                                return getDateShortText(this.value);
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Power (kWh)'
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br/>',
                        pointFormatter: function () {
                            return getDateLongText(this.category) + '<br/><b>' + roundDecimals(this.y) + '</b> kWh';
                        }
                    },
                },
                series: [{
                    name: 'Power Saved',
                    color: '#8cc63f',
                    fillColor: '#d1e8b2',
                    data: totalPowerSavedOther
                }, {
                    name: 'Power Consumed',
                    color: '#29abe2',
                    fillColor: '#b6e1dd',
                    data: powerConsumed
                }],
                title: {
                    text: ''
                }
            }
        }

        function onPowerSavingSuccess(data) {
            console.log(data);
            var dates = [];
            var powerSavedOther = [];
            var powerSavedPP = [];
            for (var i = 0; i < data.graphData.length; i++) {
                dates.push(data.graphData[i].sumDate);
                powerSavedOther.push(data.graphData[i].powerSavedOther);
                powerSavedPP.push(data.graphData[i].powerSavedPP);
            }

            vm.highchartsPowerSavingNG = {
                options: {
                    chart: {
                        type: 'column',
                        height: 220
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },
                    xAxis: {
                        categories: dates,
                        labels: {
                            formatter: function () {
                                return getDateShortText(this.value);
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Power (kWh)'
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br/>',
                        pointFormatter: function () {
                            return getDateLongText(this.category) + '<br/><b>' + roundDecimals(this.y) + '</b> kWh';
                        }
                    },
                },
                series: [{
                    name: 'Power Saved (other)',
                    color: '#29abe2',
                    data: powerSavedOther
                }, {
                    name: 'Power Saved (Powerplug)',
                    color: '#8cc63f',
                    data: powerSavedPP
                }],
                title: {
                    text: ''
                }
            }
        }

        function onActivityAnalysisSuccess(data) {            
            var dates = [];
            var idleTime = [];
            var totalDownTime = [];
            var workTime = [];
            for (var i = 0; i < data.graphData.length; i++) {
                dates.push(data.graphData[i].sumDate);
                idleTime.push(data.graphData[i].idleTime);
                totalDownTime.push(data.graphData[i].totalDownTime);
                workTime.push(data.graphData[i].workTime);
            }

            vm.highchartsComputerActivityNG = {
                options: {
                    chart: {
                        type: 'column',
                        height: 220
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            stacking: 'percent'
                        }
                    },
                    xAxis: {
                        categories: dates,
                        labels: {
                            formatter: function () {
                                return getDateShortText(this.value);;
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Percentage (%)'
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br/>',
                        pointFormatter: function () {
                            return getDateLongText(this.category) + '<br/><b>' + roundDecimals(this.percentage) + '%</b> (' + this.y + ' seconds)';
                        }
                    },
                },
                series: [{
                    name: 'Down Time (savings)',
                    color: '#8cc63f',
                    data: totalDownTime
                }, {
                    name: 'Idle Time (not in use)',
                    color: '#c1272d',
                    data: idleTime
                }, {
                    name: 'Work Time (in use)',
                    color: '#29abe2',
                    data: workTime
                }],
                title: {
                    text: ''
                }
            }
        }

        function onStatisticSuccess(data) {
            vm.statistics = data;
        }        

        function onDeviceSuccess(data) {
            vm.devices = data;
            var series = [];
            if(vm.devices.last24Hours > 0)
            {
                series.push({name: '<span style="font-family: Calibri;color:#2384b5;font-size:23px;">' + vm.devices.last24Hours + '</span><br/><span style="color:#000;font-size:12px;font-family: Calibri;font-weight:normal;">Last 24 hours</span>',
                    color: '#2384b5',
                    y: vm.devices.last24Hours
                });
            }
            if(vm.devices.lastWeek > 0)
            {
                series.push({
                    name: '<span style="font-family: Calibri;color:#0069a3;font-size:23px;">' + vm.devices.lastWeek + '</span><br/><span style="color:#000;font-size:12px;font-family: Calibri;font-weight:normal;">Last Week</span>',
                    color: '#0069a3',
                    y: vm.devices.lastWeek
                });
            }
            if(vm.devices.last30Days > 0)
            {
                series.push({
                    name: '<span style="font-family: Calibri;color:#54bce8;font-size:23px;">' + vm.devices.last30Days + '</span><br/><span style="color:#000;font-size:12px;font-family: Calibri;font-weight:normal;">Last 30 Days</span>',
                    color: '#54bce8',
                    y: vm.devices.last30Days
                });
            }

            vm.highchartsDeviceNG = {
                options: {
                    chart: {
                        type: 'pie',
                        height: 240
                    },
                    plotOptions: {
                        pie: {
                            borderWidth: 0,
                            cursor: 'default',
                            shadow: false,
                            center: ['50%', '50%'],
                            states: {
                                hover: {
                                    enabled: false
                                }
                            },
                            minSize: 130,
                            size: 130,
                            innerSize: 65,
                            dataLabels: {
                                connectorPadding: 3,
                                distance: 20
                            }
                        }
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                series: [{
                    data: series
                }],
                title: {
                    text: ''
                }
            }
        }

        function onEnergyUsageSuccess(data) {
            vm.energyUsage = data;
        }

        function onPowerPlansSuccess(data) {
            vm.powerPlans = data;            
            vm.powerPlans.activePlansConverted = [];
            var gradeArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
            for (var a = 0; a < gradeArr.length; a++) {
                var isFound = false;
                var objGrade = {};
                if (vm.powerPlans.activePlans) {
                    for (var i = 0; i < vm.powerPlans.activePlans.length; i++) {
                        if (vm.powerPlans.activePlans[i].energyGrade === gradeArr[a]) {
                            isFound = true;
                            objGrade = vm.powerPlans.activePlans[i];
                        }
                    }
                }
                
                if (isFound === true) {
                    vm.powerPlans.activePlansConverted.push(objGrade);
                }
                else {
                    vm.powerPlans.activePlansConverted.push({ energyGrade: gradeArr[a], plans: 0, computers: 0 });
                }
            }
            vm.powerPlans.activePlansConverted.push({ energyGrade: 'Unassigned', plans: 'Unassigned', computers: vm.powerPlans.unassignedComputers ? vm.powerPlans.unassignedComputers : 0 });
        }
        
        getStatisticPeriod();
        getDevicePeriod();
        getEnergyUsagePeriod();
        getPowerPlanPeriod();
        getGrapsPeriod();

        //Db Data
        vm.computerStatuses = [{ "name": "Down Time", "data": [[0, 47], [0.5, 11], [1, 74], [1.5, 84], [2, 66], [2.5, 32], [3, 32], [3.5, 90], [4, 71], [4.5, 26], [5, 37], [5.5, 16], [6, 31], [6.5, 47], [7, 8], [7.5, 3], [8, 81], [8.5, 3], [9, 48], [9.5, 31], [10, 10], [10.5, 42], [11, 42], [11.5, 11], [12, 88], [12.5, 40], [13, 33], [13.5, 36], [14, 17], [14.5, 39], [15, 35], [15.5, 70], [16, 88], [16.5, 54], [17, 75], [17.5, 64], [18, 73], [18.5, 86], [19, 37], [19.5, 73], [20, 56], [20.5, 39], [21, 9], [21.5, 25], [22, 75], [22.5, 69], [23, 10], [23.5, 31], [24, 92]], "color": "#bf2b29" }, { "name": "Idle Time", "data": [[0, 2], [0.5, 91], [1, 60], [1.5, 88], [2, 88], [2.5, 39], [3, 38], [3.5, 48], [4, 52], [4.5, 59], [5, 99], [5.5, 85], [6, 62], [6.5, 92], [7, 98], [7.5, 38], [8, 57], [8.5, 17], [9, 75], [9.5, 51], [10, 35], [10.5, 95], [11, 36], [11.5, 53], [12, 49], [12.5, 63], [13, 74], [13.5, 48], [14, 16], [14.5, 24], [15, 70], [15.5, 8], [16, 78], [16.5, 72], [17, 16], [17.5, 68], [18, 67], [18.5, 89], [19, 42], [19.5, 42], [20, 64], [20.5, 45], [21, 98], [21.5, 57], [22, 53], [22.5, 8], [23, 9], [23.5, 5], [24, 51]], "color": "#28aadc" }, { "name": "Work Time", "data": [[0, 57], [0.5, 70], [1, 45], [1.5, 91], [2, 10], [2.5, 47], [3, 44], [3.5, 6], [4, 34], [4.5, 92], [5, 62], [5.5, 55], [6, 93], [6.5, 37], [7, 88], [7.5, 74], [8, 32], [8.5, 31], [9, 2], [9.5, 71], [10, 59], [10.5, 48], [11, 30], [11.5, 95], [12, 9], [12.5, 86], [13, 15], [13.5, 60], [14, 14], [14.5, 9], [15, 5], [15.5, 46], [16, 67], [16.5, 89], [17, 57], [17.5, 72], [18, 60], [18.5, 92], [19, 47], [19.5, 10], [20, 73], [20.5, 50], [21, 87], [21.5, 88], [22, 31], [22.5, 47], [23, 9], [23.5, 78], [24, 10]], "color": "#8ec536" }]        
        //////////////////////   

        vm.changeStatisticPeriod = function () {            
            getStatisticPeriod();
        };

        vm.changeEnergyUsagePeriod = function () {
            getEnergyUsagePeriod();
        };

        vm.changeGraphPeriod = function () {
            getGrapsPeriod();
        };

        vm.changeGraphType = function () {
            getGrapsPeriod();
        };
    }
}());