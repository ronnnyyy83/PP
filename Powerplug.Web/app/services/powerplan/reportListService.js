(function () {
    'use strict';
    angular
        .module('common.services')
        .service('ReportListService', ['$state', 'ReportsResource', ReportListService]);

    function ReportListService($state, ReportsResource) {
        var _reports;
        function getRequestedReport(reportId) {
            var retReport;
            angular.forEach(_reports, function (report) {
                if (report.reportId === Number(reportId)) {
                    retReport = report;
                }
            });
            return retReport;
        }
        return {
            getReport: function (reportId, cb) {                
                if (_reports !== undefined) {
                    cb(getRequestedReport(reportId));
                }
                else {
                    ReportsResource.basic.query(function (data) {
                        _reports = data;
                        cb(getRequestedReport(reportId));
                    }, function (err) {
                        if (err.status === 401 || err.status === -1) {
                            $state.go('login');
                        }
                    });
                }
            },
            setReport: function (value) {
                _reports = value;
            },
            refreshList: function () {
                ReportsResource.basic.query(function (data) {
                    _reports = data;
                }, function (err) {
                    if (err.status === 401 || err.status === -1) {
                        $state.go('login');
                    }
                });
            }
        }
    };
}());