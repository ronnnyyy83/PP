(function () {
  'use strict';

  angular
    .module('powerPlug')
    .directive('myTreeView', function () {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        link: function ($scope, iElm, iAttrs) {

          $scope.actionOnClick = function (elem) {

            var li = elem.currentTarget;
            var ul = elem.currentTarget.nextSibling;


            if (ul) {
              var styles = getComputedStyle(ul);
              if (styles.display == "block") {
                ul.style.setProperty('display', 'none');
              } else {
                ul.style.setProperty('display', 'block');
              }
            }
          }

          function create(elem, data) {
            if (data.length > 0) {

              var ul = angular.element('<ul/>');

              angular.forEach(data, function (item) {
                var li = angular.element('<li><span><span></span><span></span></span><span>' + item.name + '</span></li>');

                $(li.children()[1]).click($scope.actionOnClick);

                if (item.hasOwnProperty('children')) {
                  create(li, item.children);
                }
                ul.append(li);
              })

              elem.append(ul, data);

            }

          }

          function addStyles(){
            var t = $('my-tree-view li');
            angular.forEach(t, function(li) {
              if( $(li).next().is('li') && $(li).children().is('ul') ) {
                var element = $(li).children()[2];
                $(element).css('border-left', '1px dotted black');
              }
            })
          }

          create(iElm, $scope.data);
          addStyles();
        }
      }
    })
}())
