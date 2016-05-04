'use strict';

/**
 * @ngdoc overview
 * @name stemmroleModelsApp
 * @description
 * # stemmroleModelsApp
 *
 * Main module of the application.
 */
angular
  .module('stemmroleModelsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/contribute', {
        templateUrl: 'views/contribute.html', 
        controller: 'ContributeCtrl'
      })
      .when('/join', {
        templateUrl: 'views/join.html', 
        controller: 'JoinCtrl'
      })
      .when('/login',  {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/findaresearcher', {
        templateUrl: 'views/findaresearcher.html', 
        controller: 'FindResearcherCtrl'
      })
      .when('/addaresearcher', {
        templateUrl: 'views/addaresearcher.html', 
        controller: 'AddResearcherCtrl'
      })
      .when('/writeatestimonial', {
        templateUrl: 'views/writeatestimonial.html', 
        controller: 'WriteTestimonialCtrl'
      })
      .when('/faq', {
        templateUrl: 'views/faq.html',
        controller: 'FaqCtrl'
      })
      .when('/codeofconduct', {
        templateUrl: 'views/codeofconduct.html',
        controller: 'CodeofConductCtrl'
      })
      .when('/privacypolicy', {
        templateUrl: 'views/privacypolicy.html',
        controller: 'PrivacyPolicyCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html', 
        controller: 'ContactCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
