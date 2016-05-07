'use strict';

angular.module('IssueTracker.project', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/projects/add', {
            templateUrl: 'app/project/project-add.html',
            controller: 'ProjectController',
            resolve:{
                isAdmin: function(identity){
                    return identity.isAdmin();
                },
                isAuthenticated: function (identity) {
                    return identity.isAuthenticated();
                },
                isTeamLeader: function(){
                    return true;
                }
            }
        });
        $routeProvider.when('/projects/:id', {
            templateUrl: 'app/project/project-with-issues.html',
            controller: 'ProjectController',
            resolve:{
                isAdmin: function(identity){
                    return identity.isAdmin();
                },
                isAuthenticated: function (identity) {
                    return identity.isAuthenticated();
                },
                isTeamLeader: function(identity, project, $route){
                    if (identity.getToken()) {
                        var id = $route.current.params.id;
                        return project.getProjectById(id)
                            .then(function(currentProject){
                                return identity.isCurrentUserProjectLeader(currentProject);
                            });
                    }else{
                        return false;
                    }
                }
            }
        });
        $routeProvider.when('/projects/:id/edit', {
            templateUrl: 'app/project/project-edit.html',
            controller: 'ProjectController',
            resolve:{
                isAdmin: function(identity){
                    return identity.isAdmin();
                },
                isAuthenticated: function (identity) {
                    return identity.isAuthenticated();
                },
                isTeamLeader: function(identity, project, $route){
                    if (identity.getToken()) {
                        var id = $route.current.params.id;
                        return project.getProjectById(id)
                            .then(function(currentProject){
                                return identity.isCurrentUserProjectLeader(currentProject);
                            });
                    }else{
                        return false;
                    }
                }
            }
        });
        $routeProvider.when('/projects', {
            templateUrl: 'app/project/projects.html',
            controller: 'ProjectController',
            resolve:{
                isAdmin: function(identity){
                    return identity.isAdmin();
                },
                isAuthenticated: function (identity) {
                    return identity.isAuthenticated();
                },
                isTeamLeader: function(){
                    return true;
                }
            }
        });
    }])

    .factory('project', ['$q','requester', 'identity', function($q, requester, identity){
        function getProjects(){
            var url = 'Projects/?pageSize=100&pageNumber=1&filterS';

            return requester.get(url, identity.getHeaderWithToken())
        };

        function getMyProjects(pageSize, page, filter) {
            var url = 'Projects/?pageSize=' + pageSize +'&pageNumber=' + page +'&filter=' + filter;

            return requester.get(url, identity.getHeaderWithToken());
        };

        function getProjectById(id){
            var url = 'Projects/' + id;

            return requester.get(url, identity.getHeaderWithToken());
        }

        function editProject(id, data){
            var url = 'Projects/' + id;

            return requester.put(url, data, identity.getHeaderWithToken());
        }

        function addProject(data){
            var url = 'Projects'

            return requester.post(url, data, identity.getHeaderWithToken());
        }

        return {
            getProjects: getProjects,
            getProjectById: getProjectById,
            getMyProjects: getMyProjects,
            editProject: editProject,
            addProject: addProject
        };
    }])

    .directive('projectLeader', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/project/project-leader.html'
        }
    })

    .controller('ProjectController', [
        '$scope',
        '$location',
        '$routeParams',
        'noty',
        'issue',
        'identity',
        'project',
        'label',
        'user',
        'isAuthenticated',
        'isAdmin',
        'isTeamLeader',
        function ($scope, $location, $routeParams, noty, issue, identity, project, label, user, isAuthenticated, isAdmin, isTeamLeader) {

            $scope.redirect = function(){
                $location.path('/home/home');
            };

            $scope.pageName = 'Project page';

            $scope.isAuthenticated = isAuthenticated;

            $scope.isAdmin = isAdmin;

            $scope.isTeamLeader = isTeamLeader;

            $scope.userId = identity.getId();

            $scope.projectToAdd = {};

            $scope.getProjectIssues = function(id){
                issue.getProjectIssues(id)
                    .then(function(success){
                        $scope.issues = success;
                    }, function(error){
                        console.log(error);
                    });
            };

            $scope.editProject = function(data){
                project.editProject($routeParams.id, data)
                    .then(function(success){
                        noty.showNoty({
                            text: 'You edited successfully a project!',
                            ttl: 5000, //time to live in miliseconds
                            type: 'success', //default, success, warning
                            options: [],
                            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                //handling code for options clicked
                            }
                        });
                        var path = '/projects/'+ success.Id;
                        $location.path(path);
                    }, function(error){
                        noty.showNoty({
                            text: 'You can not edit a project,Error: ' + error.Message.toUpperCase(),
                            ttl: 6000, //time to live in miliseconds
                            type: 'warning', //default, success, warning
                            options: [],
                            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                //handling code for options clicked
                            }
                        });
                    })
            };

            $scope.generateProjectKey = function(projectName){
                var result = ''
                if (projectName) {
                    var wordsInName = projectName.split(' ');
                    wordsInName.forEach(function(word){
                        result += word.substr(0, 1).toUpperCase();
                    });
                }
                $scope.projectToAdd.ProjectKey = result;
            };

            $scope.preparingProjectForDataBase = function(project) {
                var data = {
                    Name: project.Name,
                    Description: project.Description,
                    ProjectKey: project.ProjectKey,
                    Labels: [],
                    Priorities: [],
                    LeadId: project.LeadId.Id
                };

                var labels = project.Labels.split(',');
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

                var priorities = project.Priorities.split(',');
                for (var i = 0; i < priorities.length; i++) {
                    var priority = {
                        Name: priorities[i]
                    };
                    data.Priorities.push(priority);
                }

                return data;
            };

            $scope.addProject = function(data){
                var prepareData = $scope.preparingProjectForDataBase(data);
                project.addProject(prepareData)
                    .then(function(success){
                        noty.showNoty({
                            text: 'You create successfully new Project!',
                            ttl: 5000, //time to live in miliseconds
                            type: 'success', //default, success, warning
                            options: [],
                            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                //handling code for options clicked
                            }
                        });
                        var path = '/projects/'+ success.Id;
                        $location.path(path);
                    }, function(error){
                        noty.showNoty({
                            text: 'You can not create a project, Error: ' + error.Message.toUpperCase(),
                            ttl: 6000, //time to live in miliseconds
                            type: 'warning', //default, success, warning
                            options: [],
                            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                //handling code for options clicked
                            }
                        });
                    });
            };

            if ($scope.isAuthenticated) {

                project.getProjects()
                    .then(function(responce){
                        $scope.projects = responce;
                    });

                label.getLabels()
                    .then(function(success){
                        $scope.existingLabels = success;
                    }, function(error){
                        console.log(error);
                    });
                user.getUsers()
                    .then(function(success){
                        $scope.dataUsers = success
                    }, function(error){
                        console.log(error);
                    });

                if ($routeParams.id) {
                    project.getProjectById($routeParams.id)
                        .then(function(success){
                            $scope.project = success;
                            $scope.getProjectIssues($scope.project.Id);

                        }, function (error) {
                            console.log(error);
                        })
                }
            }
        }
    ])