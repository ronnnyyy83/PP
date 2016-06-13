angular
  .module('powerPlug')
  .directive('charts', function ($window, $timeout, $document) {
      return {
          restrict: 'E',
          replace: true,
          scope: {
              chartType: '=',
              graph: '=',
              graphHeight: '=',
              graphSpace: '='
          },
          templateUrl: 'app/directives/charts/charts.html',
          link: {
              pre: function (scope) {
                  if (!scope.graph) {
                      scope.graph = graph = [
                        {
                            name: 'Tokyo',
                            color: "#bf2b29",
                            data: [
                              [0, 7],
                              [1, 7],
                              [11, 7]
                            ]
                        }, {
                            name: 'ssssss',
                            color: "#8ec536",
                            data: [
                              [0, 7],
                              [1, 7],
                              [11, 7]
                            ]
                        }, {
                            name: 'ssssss',
                            color: "#28aadc",
                            data: [
                              [0, 7],
                              [1, 7],
                              [11, 7]
                            ]
                        }];
                      ;
                  }
                  scope.$watch('graph', build);

                  function build() {
                      scope.highchartsNG.series = scope.graph;

                  }
                  scope.highchartsNG = {
                      title: {
                          text: ''
                      },
                      options: {
                          chart: {
                              type: 'line'
                          },
                          legend: {
                              enabled: false
                          },
                          credits: {
                              enabled: false
                          },
                          exporting: {
                              enabled: false
                          },
                          loading: false,

                          plotOptions: {
                              line: {
                                  lineWidth: 3,
                                  marker: {
                                      enabled: false
                                  }
                              }
                          },
                          xAxis: {
                              gridLineWidth: 1,
                              tickWidth: 0,
                              lineWidth: 0,
                              minTickInterval: 0.1,
                              tickInterval: 1
                          },
                          yAxis: {
                              gridLineWidth: 0,
                              title: {
                                  enabled: false
                              },
                              minTickInterval: 1,
                              tickInterval: 25,
                              minRange: 100,
                              max: 100
                          }
                      }
                  };

                  //scope.highchartsNG.options.chart.width = ($window.innerWidth-329)/3;

                  if (scope.chartType == 'work') {

                      scope.title = 'Work Days';
                      scope.highchartsNG.options.chart.backgroundColor = "#fff";
                      scope.highchartsNG.options.yAxis.alternateGridColor = '#f6f6f6';
                  } else if (scope.chartType == 'non-work') {
                      scope.title = 'Non-Work Days';
                      scope.highchartsNG.options.chart.backgroundColor = "#e6e6e6";
                      scope.highchartsNG.options.yAxis.alternateGridColor = '#eeeeee';
                  }
                  else {
                      scope.highchartsNG.options.chart.backgroundColor = "#fff";
                      scope.highchartsNG.options.yAxis.alternateGridColor = '#f6f6f6';
                  }


              },
              post: function (scope) {
                  var resize = function () {
                      var widthSpace = 30;
                      if (scope.graphSpace !== undefined) {
                          widthSpace = scope.graphSpace;
                      }
                      if ($('.chart-wraper') && $('.chart-wraper')[0] && $('.chart-wraper')[0].clientWidth) {
                          scope.highchartsNG.size.width = $('.chart-wraper')[0].clientWidth - widthSpace;
                          scope.$apply();
                      }
                  }

                  angular.element($window).bind('resize', resize);

                  scope.$on('$destroy', function () {
                      angular.element($window).unbind('resize', resize);
                  });

                  $timeout(function () {
                      var height = 235;
                      var widthSpace = 30;
                      if (scope.graphHeight !== undefined) {
                          height = scope.graphHeight;
                      }
                      if (scope.graphSpace !== undefined) {
                          widthSpace = scope.graphSpace;
                      }
                      if ($('.chart-wraper') && $('.chart-wraper')[0] && $('.chart-wraper')[0].clientWidth) {
                          scope.highchartsNG.size = {
                              width: $('.chart-wraper')[0].clientWidth - widthSpace,
                              height: height
                          };
                      }
                  }, 0);
              }
          }
      };
  });
