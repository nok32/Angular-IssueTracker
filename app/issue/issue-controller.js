'use strict';

angular.module('IssueTracker.issue', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/projects/:id/:add-issue', {
            templateUrl: 'app/issue/add-issue.html',
            controller: 'IssueController'
        });
        $routeProvider.when('/issues/:id', {
            templateUrl: 'app/issue/issue.html',
            controller: 'IssueController'
        });
    }])

    .factory('issue', ['requester', 'identity', function(requester, identity){
        function getIssueById(id){
            var url = 'Issues/' + id;

            return requester.get(url, identity.getHeaderWithToken());
        };

        function getMyIssues(pageSize, pageNumber, orderByType){
            var url = 'Issues/me?pageSize=' + pageSize +'&pageNumber=' + pageNumber + '&orderBy=' + orderByType;

            return requester.get(url, identity.getHeaderWithToken());
        };

        return{
            getIssueById : getIssueById,
            getMyIssues : getMyIssues
        };
    }])

    .controller('IssueController', [
        '$scope',
        '$routeParams',
        'identity',
        'requester',
        'users',
        'projects',
        'issue',
        function($scope, $routeParams, identity, requester, users, projects, issue){
            
            if($routeParams.add) {
                $scope.isInIssueAdd = true;
                $scope.projectId = $routeParams.id;

                users.getUsers()
                    .then(function(responce){
                        $scope.dataUsers = responce;
                    });

                projects.getProjects()
                    .then(function(responce){
                        $scope.dataProjects = responce;
                    });

                projects.getProjectById($scope.projectId)
                    .then(function(responce){
                        $scope.projectCurrent = responce;
                        var projectLabels = []
                        $scope.projectCurrent.Labels.forEach(function(a){
                            projectLabels.push(a);
                        });
                        $scope.projectLabels = projectLabels
                    });
            }

            if($routeParams.id) {
                issue.getIssueById($routeParams.id)
                    .then(function(success){
                        $scope.issue = success;
                        console.log($scope.issue);
                    })
            }


            $scope.addIssue = function(issueToAdding){
                var data = {
                    Title: issue.Title,
                    Description: issue.Description,
                    DueDate: issue.DueDate,
                    ProjectId: JSON.parse(issue.Project).Id,
                    AssigneeId: issue.Assignee.Id,
                    PriorityId: JSON.parse(issue.Priority).Id,
                    Labels: []
                };

                var label = {
                    Name:issue.Label
                };

                data.Labels.push(label);

                var url = 'Issues/';

                requester.post(url, data, identity.getHeaderWithToken())
                    .then(function(success){
                        console.log(success);
                    }, function(error){
                        console.log(error);
                    });

                //TODO
            }
        }
    ]);