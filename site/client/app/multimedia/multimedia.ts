'use strict';

angular.module('stemmrollmodelsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('multimedia', {
        url: '/multimedia',
        template: '<multimedia></multimedia>'
      });
  });
