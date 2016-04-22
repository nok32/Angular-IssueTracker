'use strict';

// Declare app level module which depends on views, and components
angular.module('IssueTracker', [
    'ngRoute',
    'IssueTracker.view1',
    'IssueTracker.identifier',
    'IssueTracker.mainController',
    'IssueTracker.user'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
