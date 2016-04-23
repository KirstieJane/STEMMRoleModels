'use strict';

angular.module('stemmrollmodelsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newsearch', {
        url: '/newsearch',
        template: '<newsearch></newsearch>'
      });
  });
