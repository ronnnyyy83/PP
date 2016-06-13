angular
  .module('powerPlug')
  .directive('descripotion', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        done: '&',
        preview: '&',
        defaultText: '=',
        showBtns: '='
      },
      templateUrl: 'app/directives/descripotion/descripotion.html',
      link: {
        pre: function(scope) {
          scope.uiTinymceConfig = {
            elementpath: false,
            plugins: 'link textcolor directionality anchor table',
            fontsize_formats: '8px 9px 10px 11px 12px 13px 14px 16px 18px 20px',
            toolbar: "| ltr rtl | removeformat table | outdent indent bullist numlist | alignjustify alignleft aligncenter alignright | anchor link | forecolor bold italic underline | fontsizeselect | fontselect"
          };

        },
        post: function(scope) {
          scope.doneAction = function() {
            scope.done({
              data: scope.defaultText
            });
          }

          scope.previewAction = function() {
            scope.preview({
              data: scope.defaultText
            });
          }
        }
      }
    };
  });
