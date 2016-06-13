(function() {
  'use strict';

 angular
   .module('powerPlug')
    .directive('colorLetter', function(jsonLoader) {
      return {
        restrict: 'A',
        scope: {
          letter: '='
        },
        link: function($scope, iElm, iAttrs) {
            $scope.onReadyLoadColors = function (colorsMap) {                
            $scope.colorsMap = colorsMap;
            $scope.$watch('letter', function () {
              switch ($scope.letter) {
                case "A":
                  iElm.css({
                    'color': $scope.colorsMap.A
                  });
                  iElm.html($scope.letter);
                  break;
                case "B":
                  iElm.css({
                    'color': $scope.colorsMap.B
                  });
                  iElm.html($scope.letter);
                  break;
                case "C":
                  iElm.css({
                    'color': $scope.colorsMap.C
                  });
                  iElm.html($scope.letter);
                  break;
                case "D":
                  iElm.css({
                    'color': $scope.colorsMap.D
                  });
                  iElm.html($scope.letter);
                  break;
                case "E":
                  iElm.css({
                    'color': $scope.colorsMap.E
                  });
                  iElm.html($scope.letter);
                  break;
                case "F":
                  iElm.css({
                    'color': $scope.colorsMap.F
                  });
                  iElm.html($scope.letter);
                  break;
                case "G":
                    iElm.css({
                        'color': $scope.colorsMap.G
                    });
                    iElm.html($scope.letter);
                    break;
                case "undefined":
                  iElm.css({
                    'color': 'black'
                  });
                  break;
                default:
                iElm.css({
                  'color': 'black'
                });
                iElm.html($scope.letter);
              }
            })
          };
          jsonLoader.getJSON($scope.onReadyLoadColors, null, "directives/colorLetter/colorsMap.json");
        }
      };
    })
})();
