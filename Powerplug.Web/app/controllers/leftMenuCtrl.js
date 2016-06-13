(function () {
    'use strict';

    angular
      .module('powerPlug')
      .controller('LeftMenuController', ['$state', function ($state) {
          var vm = this;
          vm.state = $state;

          vm.keepOpened = function (e) {
            e.stopPropagation();
          }


          //tmp
          function getTitle() {
            return (vm.state.current.policyName);
          }
          vm.menuItems = [
          {
              "text": "Dashboard",
              "sref": "dashboard",
              "icon": "fa fa-home",
              "submenu": []
          },
          {
              "text": "Saving Plans",
              "sref": "savingPlans",
              "icon": "fa fa-list-alt",
              "stateName": "Savings",
              "submenu": [
                {
                    "text": getTitle,
                    "sref": ""
                }
              ]
          },
          {
              "text": "Reports",
              "sref": "reports",
              "icon": "fa fa-line-chart",
              "submenu": []
          },
          {
              "text": "Settings",
              "sref": "settings",
              "icon": "fa fa-gear",
              "submenu": []
          }];
      }]);
})();
