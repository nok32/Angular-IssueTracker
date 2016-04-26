'use strict';

// Declare app level module which depends on views, and components
angular.module('IssueTracker', [
    'ngRoute',
    'IssueTracker.view1',
    'IssueTracker.identifier',
    'IssueTracker.issue',
    'IssueTracker.main',
    'IssueTracker.user',
    'IssueTracker.home',
    'IssueTracker.project',
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
