'use strict';

// Declare app level module which depends on views, and components
angular.module('IssueTracker', [
    'ngRoute',
    'ngAnimate',
    'angular-noty',
    'IssueTracker.view1',
    'IssueTracker.identifier',
    'IssueTracker.label',
    'IssueTracker.issue',
    'IssueTracker.project',
    'IssueTracker.user',
    'IssueTracker.home',
    'IssueTracker.main',
    'datetimepicker',
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
