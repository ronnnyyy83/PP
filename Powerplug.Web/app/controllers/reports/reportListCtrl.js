(function () {
    'use strict';
    angular

        .module('powerPlug')
        .controller('ReportListCtrl', ['$state', '$stateParams', 'ReportsResource', 'ReportListService', 'ReportTemplateService', ReportListCtrl]);

    function ReportListCtrl($state, $stateParams, ReportsResource, ReportListService, ReportTemplateService) {
        var vm = this;

        ReportsResource.basic.query(function (data) {
            onReportsSuccess(data);
        }, function (err) {
            onError(err);
        });

        ReportsResource.template.query(function (data) {
            onReportTemplatesSuccess(data);
        }, function (err) {
            onError(err);
        });

        vm.goToReport = function () {
            $state.go('reportGenerate', { reportId: vm.reportType })
        };
        
        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }
        
        function onReportsSuccess(data) {
            vm.reports = data;
            ReportListService.setReport(vm.reports);
        }

        function onReportTemplatesSuccess(data) {
            vm.reportTemplates = data;
            ReportTemplateService.setReportTemplate(vm.reportTemplates);
        }

        vm.removeTemplate = function (templateId) {
            angular.forEach(vm.reportTemplates, function (value, key) {
                if (value.savedReportId === templateId) {
                    value.$delete({ templateId: templateId }, function (res) {
                        vm.reportTemplates.splice(key, 1);
                        ReportTemplateService.setReportTemplate(vm.reportTemplates);
                    }, function (err) {
                        onError(err);
                    });
                }
            });
        }
    }
}());
