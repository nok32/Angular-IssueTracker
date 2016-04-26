'use strict';

angular.module('IssueTracker.issue', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/projects/:id/:add-issue', {
            templateUrl: 'app/issue/add-issue.html',
            controller: 'IssueController'
        });
    }])

    .controller('IssueController', [
        '$scope',
        '$routeParams',
        'identity',
        'requester',
        'users',
        'projects',
        function($scope, $routeParams, identity, requester, users, projects){
            
            if($routeParams.add) {
                $scope.isInIssueAdd = true;
                $scope.projectId = $routeParams.id;
                users.getUsers()
                    .then(function(responce){
                        $scope.users = responce;
                    });
                projects.getProjects()
                    .then(function(responce){
                        $scope.projects = responce;
                    });
                projects.getProjectById($scope.projectId)
                    .then(function(responce){
                        $scope.projectCurrent = responce;
                    });
            }
        }
    ]);