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
                        var projectLabels = ' ';
                        $scope.projectCurrent.Labels.forEach(function(a){
                            projectLabels += a.Name + ', ';
                        });
                        $scope.projectLabels = projectLabels
                    });
            }

            $scope.addIssue = function(issue){
                var assignee = {
                    Id: issue.Assignee.Id,
                    Username: issue.Assignee.Username,
                    isAdmin: issue.Assignee.isAdmin
                };

                var author = {
                    Id: identity.getId(),
                    Username: identity.getUsername(),
                    isAdmin: identity.isAdmin()
                };

                var project = {
                    Id: issue.Project.Id,
                    Name: issue.Project.Name
                };

                var status = {
                    Id:2,
                    Name: "Open"
                };

                var priority = {
                    Id: issue.Priority.Id,
                    Name: issue.Priority.Name
                };

                var data = {
                    Assignee: assignee,
                    Author: author,
                    AvailableStatuses: [],
                    Description: issue.Description,
                    DueDate: issue.DueDate,
                    Labels: [],
                    Priority: priority,
                    Project: project,
                    Status: status,
                    Title: issue.Title
                };

                console.log(data);

                //TODO
            }
        }
    ]);