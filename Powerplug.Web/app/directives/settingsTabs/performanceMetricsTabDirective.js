(function () {
    'use strict';
    angular
        .module('powerPlug').directive('performanceMetricsTab', function () {
            return {
                templateUrl: "../../../views/powerplan/settingsTabs/performanceMetrics.html",
                scope: {
                    jsonobject: '=',
                    worktype: '@',
                    saveEvent: '=' //Indcates there is no event that save the data to json .. every change is made will be made on the original json
                },
                link: function (scope, element, attrs) {
                    //=========private functions=========
                    var initScopeVariables = function () {
                        scope.isCpu = false;
                        scope.isIo = false;
                        scope.isNetwork = false;
                        if (scope.jsonobject.computerMetricsConverted.Cpu) {
                            scope.isCpu = true;
                            scope.cpuThreshold = scope.jsonobject.computerMetricsConverted.Cpu.threshold;
                            scope.cpuThresholdInKb = scope.jsonobject.computerMetricsConverted.Cpu.threshold;
                        }
                        if (scope.jsonobject.computerMetricsConverted.Io) {
                            scope.isIo = true;
                            scope.ioThresholdInKb = scope.jsonobject.computerMetricsConverted.Io.thresholdInKb;
                        }
                        if (scope.jsonobject.computerMetricsConverted.Network) {
                            scope.isNetwork = true;
                            scope.networkThresholdInKb = scope.jsonobject.computerMetricsConverted.Network.thresholdInKb;
                        }

                    }
                    var saveToJson = function () {
                        var Io, Cpu, Network;
                        //Clear Json array
                        scope.jsonobject.computerMetrics = [];
                        scope.jsonobject.computerMetricsConverted = {};
                        if (scope.isCpu) {
                            Cpu = {}
                            Cpu.counter = "Cpu";
                            Cpu.threshold = scope.cpuThreshold ? scope.cpuThreshold : 0;
                            Cpu.thresholdInKb = scope.cpuThreshold;
                            //Update Json Object
                            scope.jsonobject.computerMetrics.push(Cpu);
                            //Update Converted Json
                            scope.jsonobject.computerMetricsConverted.Cpu = Cpu;
                        }
                        if (scope.isIo) {
                            Io = {}
                            Io.counter = "Io";
                            Io.threshold = scope.ioThresholdInKb * 1024;
                            Io.thresholdInKb = scope.ioThresholdInKb ? scope.ioThresholdInKb : 0;
                            scope.jsonobject.computerMetrics.push(Io);
                            scope.jsonobject.computerMetricsConverted.Io = Io;
                        }
                        if (scope.isNetwork) {
                            Network = {}
                            Network.counter = "Network";
                            Network.threshold = scope.networkThresholdInKb * 1024;
                            Network.thresholdInKb = scope.networkThresholdInKb ? scope.networkThresholdInKb : 0;
                            scope.jsonobject.computerMetrics.push(Network);
                            scope.jsonobject.computerMetricsConverted.Network = Network;
                        }
                    }
                    var validateFields = function () {
                        // validate cpuThreshold input
                        if (scope.cpuThreshold < 0) {
                            scope.cpuThreshold = 0
                        } else if (scope.cpuThreshold > 100) {
                            scope.cpuThreshold = 100
                        }
                        // validate ioThresholdInKb input
                        if (scope.ioThresholdInKb < 0) {
                            scope.ioThresholdInKb = 0
                        }
                        // validate networkThresholdInKb input
                        if (scope.networkThresholdInKb < 0) {
                            scope.networkThresholdInKb = 0
                        }
                    }
                    //=========Scope Bind=========
                    if (!scope.saveEvent) {
                        scope.$watch('jsonobject', function (newValue, oldValue) {
                            if (typeof(newValue) !== 'undefined') {
                                initScopeVariables();
                            }
                        });
                    }
                    else if (typeof (scope.jsonobject) != 'undefined' && scope.jsonobject.computerMetricsConverted) {
                        initScopeVariables();
                    }
                    //update json if saveEvent = false ; update json every time checkbox or input value changed
                    scope.ShouldOnChangeUpdateJson = function(){
                        validateFields();
                        if (!scope.saveEvent) {
                            saveToJson()
                        }
                       
                    }
                    scope.$on('saveSettings', function (event, data) {
                        saveToJson();
                     });
                }
            }
        })
}());
