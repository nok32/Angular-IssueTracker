'use strict';

angular.module('IssueTracker.issue', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/projects/:id/:add-issue', {
            templateUrl: 'app/issue/add-issue.html',
            controller: 'IssueController',
            resolve: {
                isAdmin: function(identity){
                    return identity.isAdmin();
                },
                isAuthenticated: function ($route,identity) {
                    return identity.isAuthenticated();
                },
                isTeamLeader: function (identity, $route, project) {
                    if (identity.getToken()) {
                        var id = $route.current.params.id;
                        return project.getProjectById(id)
                            .then(function(currentProject){
                                return identity.isCurrentUserProjectLeader(currentProject);
                            });
                    }else{
                        return false;
                    }
                },
                isCurrentUserAssignee: function () {
                    return true;
                }
            }
        });
        $routeProvider.when('/issues/:id', {
            templateUrl: 'app/issue/issue.html',
            controller: 'IssueController',
            resolve:{
                isAdmin: function(identity){
                    return identity.isAdmin();
                },
                isAuthenticated: function (identity) {
                    return identity.isAuthenticated();
                },
                isTeamLeader: function(identity, $route, project, issue){
                        var id = $route.current.params.id;
                        return issue.getIssueById(id)
                            .then(function(issueProject){
                                return project.getProjectById(issueProject.Project.Id)
                                    .then(function(issueFullProject){
                                        var result = identity.isCurrentUserProjectLeader(issueFullProject);
                                        return result;
                                    });
                            })
                },
                isCurrentUserAssignee : function(issue, $route, identity){
                    return issue.getIssueById($route.current.params.id)
                        .then(function(currentIssue){
                            if(currentIssue.Assignee.Id === identity.getId()){
                                return true;
                            }else{
                                return false;
                            }
                        });
                }
            }
        });
        $routeProvider.when('/issues/:id/edit', {
            templateUrl: 'app/issue/edit-issue.html',
            controller: 'IssueController',
            resolve:{
                isAdmin: function(identity){
                    return identity.isAdmin();
                },
                isAuthenticated: function (identity) {
                    return identity.isAuthenticated();
                },
                isTeamLeader: function(identity, $route, project, issue){
                    var id = $route.current.params.id;
                    return issue.getIssueById(id)
                        .then(function(issueProject){
                            return project.getProjectById(issueProject.Project.Id)
                                .then(function(issueFullProject){
                                    var result = identity.isCurrentUserProjectLeader(issueFullProject);
                                    return result;
                                });
                        })
                },
                isCurrentUserAssignee : function(issue, $route, identity){
                    return issue.getIssueById($route.current.params.id)
                        .then(function(currentIssue){
                            if(currentIssue.Assignee.Id === identity.getId()){
                                return true;
                            }else{
                                return false;
                            }
                        });
                }
            }
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

        function editIssue(id, data){
            var url = 'Issues/' + id;

            return requester.put(url, data, identity.getHeaderWithToken());
        }

        return{
            getIssueById : getIssueById,
            getMyIssues : getMyIssues,
            getProjectIssues: getProjectIssues,
            addNewIssue: addNewIssue,
            issueChangeStatus: issueChangeStatus,
            editIssue: editIssue
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
        '$location',
        'noty',
        'user',
        'project',
        'issue',
        'label',
        'isAuthenticated',
        'isTeamLeader',
        'isCurrentUserAssignee',
        'isAdmin',
        function($scope, $routeParams, $location, noty, user, project, issue, label, isAuthenticated, isTeamLeader, isCurrentUserAssignee, isAdmin){

            $scope.convertToJSON = function convertToJSON(obj) {
                try {
                    JSON.parse(obj);
                } catch (e) {
                    return obj
                }
                return JSON.parse(obj);
            };

            $scope.isAuthenticated = isAuthenticated;

            $scope.isAssignee = isCurrentUserAssignee;

            $scope.isAdmin = isAdmin;

            $scope.isTeamLeader = isTeamLeader;

            $scope.pageName = 'Issue page';

            $scope.redirect = function(){
                $location.path('/home/home');
            };

            $scope.issueChangeStatus = function(id, statusId){
                issue.issueChangeStatus(id, statusId)
                    .then(function(success){
                        issue.getIssueById(id)
                            .then(function(success){
                                $scope.issue = success;
                                project.getProjectById($scope.issue.Project.Id)
                                    .then(function(success){
                                        $scope.project = success;
                                    }, function (error) {
                                        console.log(error);
                                    })
                            })
                    }, function(error){
                        console.log(error);
                    })
            }

            $scope.getExistingLabels = function(){
                label.getLabels()
                    .then(function(success){
                        $scope.existingLabels = success;
                    }, function(error){
                        console.log(error);
                    })
            };

            $scope.preparingIssueForDataBase = function(issueData){

                issueData.Project = $scope.convertToJSON(issueData.Project);
                issueData.Priority = $scope.convertToJSON(issueData.Priority);

                    var data = {
                        Title: issueData.Title,
                        Description: issueData.Description,
                        DueDate: issueData.DueDate,
                        ProjectId: issueData.Project.Id,
                        AssigneeId: issueData.Assignee.Id,
                        PriorityId: issueData.Priority.Id,
                        Labels: []
                    };

                    var labels = issueData.Label.split(',');

                    for (var i = 0; i < labels.length; i++) {
                        var exist = false;
                        for (var j = 0; j < $scope.existingLabels.length; j++) {
                            if ($scope.existingLabels[j].Name === labels[i].Name) {
                                exist = true;
                                data.Labels.push($scope.existingLabels[j]);
                                break;
                            }
                        }

                        if (!exist) {
                            var label = {
                                Name: labels[i]
                            };

                            data.Labels.push(label);
                        }
                    }

                    return data;
            };

            if($routeParams.add && $scope.isAuthenticated) {
                $scope.isInIssueAdd = true;
                $scope.projectId = $routeParams.id;

                project.getProjects()
                    .then(function(responce){
                        $scope.dataProjects = responce;
                    });

                project.getProjectById($scope.projectId)
                    .then(function(responce){
                        $scope.projectCurrent = responce;
                    });
                $scope.getExistingLabels();

                user.getUsers()
                    .then(function(responce){
                        $scope.dataUsers = responce;
                    });
            }

            if($routeParams.id && $scope.isAuthenticated) {
                user.getUsers()
                    .then(function(responce){
                        $scope.dataUsers = responce;
                    });

                project.getProjects()
                    .then(function(responce){
                        $scope.dataProjects = responce;
                    });

                $scope.getExistingLabels();

                issue.getIssueById($routeParams.id)
                    .then(function(success){
                        $scope.issue = success;
                        project.getProjectById($scope.issue.Project.Id)
                            .then(function(success){
                                $scope.project = success;

                                $scope.issueToEdit = $scope.issue;

                            }, function (error) {
                                console.log(error);
                            })
                    });
            }

            $scope.addIssue = function(issueToAdding){

                var data = $scope.preparingIssueForDataBase(issueToAdding);

                issue.addNewIssue(data)
                    .then(function(success){
                        noty.showNoty({
                            text: 'You created  successfully new issue!',
                            ttl: 5000, //time to live in miliseconds
                            type: 'success', //default, success, warning
                            options: [],
                            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                //handling code for options clicked
                            }
                        });
                        var path = '/issues/'+ success.Id;
                        $location.path(path);
                    }, function(error){
                        noty.showNoty({
                            text: 'You can not create a issue, Error: ' + error.Message.toUpperCase(),
                            ttl: 6000, //time to live in miliseconds
                            type: 'warning', //default, success, warning
                            options: [],
                            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                //handling code for options clicked
                            }
                        });
                    });
            };

            $scope.editIssue = function(id, issueWithEditedData){

                var data = $scope.preparingIssueForDataBase(issueWithEditedData);

                issue.editIssue(id, data)
                    .then(function(success){
                        noty.showNoty({
                            text: 'You edited  successfully a issue!',
                            ttl: 5000, //time to live in miliseconds
                            type: 'success', //default, success, warning
                            options: [],
                            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                //handling code for options clicked
                            }
                        });

                        var path = '/issues/'+ id;
                        $location.path(path);
                    }, function(error) {
                        noty.showNoty({
                            text: 'You can not edit a issue, Error: ' + error.Message.toUpperCase(),
                            ttl: 6000, //time to live in miliseconds
                            type: 'warning', //default, success, warning
                            options: [],
                            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                //handling code for options clicked
                            }
                        });
                    })
            }
        }
    ]);