(function() {
  'use strict';

  angular
    .module('powerPlug')
    .factory('jsonLoader', function($http) {
      this.getJSON = getJSON;
      return this;
      function getJSON(onReady, onError, filename) {

        var menuURL = 'app/' + filename + '?v=' + (new Date().getTime()); // jumps cache

        onError = onError || function() {
          alert('Failure loading menu');
        };

        $http
          .get(menuURL)
          .success(onReady)
          .error(onError);
      }

    })
})();
