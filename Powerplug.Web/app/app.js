(function () {
    'use strict';

    angular
        .module('powerPlug', ['ngCookies', 'ngMaterial', 'ng-fusioncharts', 'ui.router', 'ngAnimate',
            'ui.bootstrap', 'textAngular', 'common.services', 'highcharts-ng', 'ngScrollbars', 'ui.tinymce', 'ui.sortable'])
        .config(configRoute)
        .config(configExceptionHandler)
        .config(configDatePicker)
        .run(run);

    configDatePicker.$inject = ['$mdDateLocaleProvider'];
    function configDatePicker($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return moment(date).format('YYYY-MM-DD');
        };
    }

    configExceptionHandler.$inject = ['$provide'];
    function configExceptionHandler($provide) {
        $provide.decorator("$exceptionHandler",
            ["$delegate",
                function ($delegate) {
                    return function (exception, cause) {
                        console.log(exception);
                        console.log(cause);
                        exception.message = "Error occured \n Message:" + exception.message;
                        $delegate(exception, cause);
                        //alert(exception.message);
                    };
                }
            ]);
    }

    configRoute.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    function configRoute($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state('login', {
                url: "/login",
                controller: 'LoginCtrl',
                templateUrl: 'views/login/login.html',
                controllerAs: 'vm'
            })
            .state('dashboard', {
                url: "/dashboard",
                controller: 'DashboardCtrl',
                templateUrl: 'views/dashboard/dashboard.html',
                controllerAs: 'vm',
                title: 'Dashboard'
            })
            .state('savingPlans', {
                url: "/savingPlans",
                controller: 'SavingPlansCtrl',
                templateUrl: 'views/powerplan/savingPlans.html',
                controllerAs: 'vm',
                title: 'Saving Plans'
            })
            .state('savingPlanEditor', {
                url: "/savingPlans/:policyId",
                views: {
                    '': {
                        templateUrl: 'views/powerplan/savingPlanEditor.html',
                        controller: 'SavingPlanEditorCtrl',
                        controllerAs: 'vm'
                    },
                    'overview@savingPlanEditor': {
                        templateUrl: 'views/powerplan/savingPlanOverview.html'
                    },
                    'workhoursaction@savingPlanEditor': {
                        templateUrl: 'views/powerplan/savingPlanWorkHoursActions.html'
                    },
                    'worktimesaction@savingPlanEditor': {
                        templateUrl: 'views/powerplan/savingPlanWorkTime.html'
                    },
                    'events@savingPlanEditor': {
                        templateUrl: 'views/powerplan/savingPlanEvents.html'
                    },
                    'computers@savingPlanEditor': {
                        templateUrl: 'views/powerplan/savingPlanComputers.html'
                    },
                    'settings@savingPlanEditor': {
                        templateUrl: 'views/powerplan/savingPlanSettings.html'
                    },
                    'permissions@savingPlanEditor': {
                        templateUrl: 'views/powerplan/savingPlanPermissions.html'
                    },
                    'description@savingPlanEditor': {
                        templateUrl: 'views/powerplan/savingPlanDescription.html'
                    }
                },
                title: 'Savings'
            })
            .state('settings', {
                url: "/settings",
                templateUrl: 'views/settings/settingsList.html',
                title: 'Settings'
            })
            .state('computerGroups', {
                url: "/settings/computer-groups",
                controller: 'ComputerGroupsCtrl',
                templateUrl: 'views/settings/computerGroups.html',
                controllerAs: 'vm',
                title: 'Settings > Computer Groups'
            })
            .state('scripts', {
                url: "/settings/scripts",
                controller: 'ScriptsCtrl',
                templateUrl: 'views/settings/scripts.html',
                controllerAs: 'vm',
                title: 'Settings > Scripts Library'
            })
            .state('wakeonLan', {
                url: "/settings/wakeonlan",
                controller: 'WakeOnLanCtrl',
                templateUrl: 'views/settings/wakeOnLan.html',
                controllerAs: 'vm',
                title: 'Settings > Wake On LAN'
            })
            .state('configuration', {
                url: "/settings/configuration",
                views: {
                    '': {
                        templateUrl: 'views/settings/configuration.html',
                        controller: 'ConfigurationCtrl',
                        controllerAs: 'vm'
                    },
                    'agent@configuration': {
                        templateUrl: 'views/settings/configuration/agent.html'
                    },
                    'console@configuration': {
                        templateUrl: 'views/settings/configuration/console.html'
                    },
                    'system@configuration': {
                        templateUrl: 'views/settings/configuration/system.html'
                    },
                    'general@configuration': {
                        templateUrl: 'views/settings/configuration/general.html'
                    },
                },
                controllerAs: 'vm',
                title: 'Settings > Configuration'
            })
            .state('powerConsumption', {
                url: "/settings/powerConsumption",
                controller: 'PowerConsumptionCtrl',
                templateUrl: 'views/settings/powerConsumption.html',
                controllerAs: 'vm',
                title: 'Settings > Computer Power Consumption'
            })
            //.state('consolePermission', {
            //    url: "/settings/consolePermission",
            //    controller: 'ConsolePermissionCtrl',
            //    templateUrl: 'views/settings/consolePermission.html',
            //    controllerAs: 'vm',
            //    title: 'Settings > Console Permission'
            //})
            .state('electricityPrice', {
                url: "/settings/electricityPrice",
                controller: 'ElectricityPriceCtrl',
                templateUrl: 'views/settings/electricityPrice.html',
                controllerAs: 'vm',
                title: 'Settings > Electricity Price'
            })
            .state('wakeupPortalPermission', {
                url: "/settings/wakeupPortalPermission",
                controller: 'WakeupPortalPermissionCtrl',
                templateUrl: 'views/settings/wakeupPortalPermission.html',
                controllerAs: 'vm',
                title: 'Settings > Wake-Up Portal Permission'
            })
            .state('locations', {
                url: "/settings/locations",
                controller: 'LocationsCtrl',
                templateUrl: 'views/settings/locations.html',
                controllerAs: 'vm',
                title: 'Settings > Locations & Power Rates'
            })
            .state('licensing', {
                url: "/settings/licensing",
                controller: 'LicensingCtrl',
                templateUrl: 'views/settings/licensing.html',
                controllerAs: 'vm',
                title: 'Settings > Product Licensing'
            })
            .state('about', {
                url: "/settings/about",
                templateUrl: 'views/settings/about.html',
                title: 'Settings > About'
            })
            .state('reports', {
                url: "/reports",
                controller: 'ReportListCtrl',
                templateUrl: 'views/reports/reportList.html',
                controllerAs: 'vm',
                title: 'Reports'
            })
            .state('reportGenerate', {
                url: "/reports/generate/:reportId/:templateId",
                controller: 'ReportGenerateCtrl',
                templateUrl: 'views/reports/reportGenerate.html',
                controllerAs: 'vm',
                title: 'Create a report'
            });

    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http', '$state', '$timeout'];
    function run($rootScope, $location, $cookies, $http, $state, $timeout) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};

        //console.log($rootScope.globals.currentUser);
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.token; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            $rootScope.globals = $cookies.getObject('globals') || {};
            var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $timeout(function(){ $state.go('login') }, 0);
            }
        });

        $rootScope.menuActive = function (url) {
            return $location.path() === url;
        }

        $rootScope.innerTemplate = function () {
            return $location.path() !== '/login';
        }
    }
}());
