'use strict';

// Declare app level module which depends on views, and components
angular.module('IssueTracker', [
    'ngRoute',
    'IssueTracker.view1',
<<<<<<< HEAD
    'IssueTracker.user',
]).config(['$routeProvider', function($routeProvider) {
=======
    'IssueTracker.user'
])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net')

    .config(['$routeProvider', function($routeProvider) {
>>>>>>> eed7d360f7c0b2ce8428ca9318c7f6627957ed96
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
