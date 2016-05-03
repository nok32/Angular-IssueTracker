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

        function getMyIssues(pageSize, pageNumber, orderByType){
            var url = 'Issues/me?pageSize=' + pageSize +'&pageNumber=' + pageNumber + '&orderBy=' + orderByType;

            return requester.get(url, identity.getHeaderWithToken());
        }

        function getProjectIssues(id){
            var url = 'Projects/' + id + '/Issues';

            return requester.get(url, identity.getHeaderWithToken());
        }

        function addNewIssue(data){
            var url = 'Issues/';

            return requester.post(url, data, identity.getHeaderWithToken());
        }

        function issueChangeStatus(id, statusId){
            var url = 'Issues/' + id + '/changestatus?statusid=' + statusId;

            return requester.put(url, undefined,identity.getHeaderWithToken());
        }

        return{
            getIssueById : getIssueById,
<<<<<<< HEAD
            getMyIssues : getMyIssues,
            getProjectIssues: getProjectIssues,
            addNewIssue: addNewIssue,
            issueChangeStatus: issueChangeStatus
=======
            getMyIssues : getMyIssues
>>>>>>> remotes/origin/master
        };
    }])

    .directive('changeStatus', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/issue/change-status-of-issue.html'
        }
    })

    .directive('issueProjectLeader', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/issue/issue-project-leader.html'
        }
    })

    .controller('IssueController', [
        '$scope',
        '$routeParams',
        'identity',
        'users',
        'projects',
        'issue',
        function($scope, $routeParams, identity, users, projects, issue){

            $scope.isAuthenticated = identity.isAuthenticated();
            $scope.redirect = function(){
                projects.redirect();
            };

            $scope.isCurrentUserAssignee = function(issue){
                if(issue.Assignee.Id === identity.getId()){
                    $scope.isAssignee = true;
                }else{
                    $scope.isAssignee = false;
                }
            };

            $scope.issueChangeStatus = function(id, statusId){
                issue.issueChangeStatus(id, statusId)
                    .then(function(success){
                        console.log(success);
                        issue.getIssueById(id)
                            .then(function(success){
                                $scope.issue = success;
                                $scope.isCurrentUserAssignee($scope.issue);
                                projects.getProjectById($scope.issue.Project.Id)
                                    .then(function(success){
                                        $scope.project = success;
                                        if(identity.isCurrentUserProjectLeader($scope.project) || identity.isAdmin()){
                                            $scope.isCurentUserAdminOrProjectLeader = true;
                                        }else{
                                            $scope.isCurentUserAdminOrProjectLeader = false;
                                        }
                                    }, function (error) {
                                        console.log(error);
                                    })
                            })

                    }, function(error){
                        console.log(error);
                    })
            }

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
                        $scope.isCurrentUserAssignee($scope.issue);
                        projects.getProjectById($scope.issue.Project.Id)
                            .then(function(success){
                                $scope.project = success;
                                if(identity.isCurrentUserProjectLeader($scope.project) || identity.isAdmin()){
                                    $scope.isCurentUserAdminOrProjectLeader = true;
                                }else{
                                    $scope.isCurentUserAdminOrProjectLeader = false;
                                }

                            }, function (error) {
                                console.log(error);
                            })
                    })
            }


            $scope.addIssue = function(issueToAdding){
                var data = {
                    Title: issueToAdding.Title,
                    Description: issueToAdding.Description,
                    DueDate: issueToAdding.DueDate,
                    ProjectId: JSON.parse(issueToAdding.Project).Id,
                    AssigneeId: issueToAdding.Assignee.Id,
                    PriorityId: JSON.parse(issueToAdding.Priority).Id,
                    Labels: []
                };

                var label = {
                    Name:issueToAdding.Label
                };

                data.Labels.push(label);

                issue.addNewIssue(data)
                    .then(function(success){
                        console.log(success);
                    }, function(error){
                        console.log(error);
                    });

                //TODO
            }
        }
    ]);