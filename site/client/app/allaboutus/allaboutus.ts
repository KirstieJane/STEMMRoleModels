'use strict';

angular.module('stemmrollmodelsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('allaboutus', {
        url: '/allaboutus',
        template: '<allaboutus></allaboutus>'
      });
  });
