'use strict';

angular.module('IssueTracker.project', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/projects/add', {
            templateUrl: 'app/project/project-add.html',
            controller: 'ProjectController'
        });
        $routeProvider.when('/projects/:id', {
            templateUrl: 'app/project/project-with-issues.html',
            controller: 'ProjectController'
        });
        $routeProvider.when('/projects/:id/edit', {
            templateUrl: 'app/project/project-edit.html',
            controller: 'ProjectController'
        });
        $routeProvider.when('/projects', {
            templateUrl: 'app/project/projects.html',
            controller: 'ProjectController'
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
        'issue',
        'identity',
        'project',
        'label',
        'user',
        function ($scope, $location, $routeParams, issue, identity, project, label, user) {

            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.userId = identity.getId();

            $scope.isAdmin = identity.isAdmin();

            $scope.isTeamLeader = function(project){
                if(identity.isCurrentUserProjectLeader(project)){
                    return true;
                }else{
                    return false;
                }
            };

            $scope.projectToAdd = {};

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

            $scope.isCurrentUserAdminOrProjectLeader = function(project){
                if(identity.isAdmin() || identity.isCurrentUserProjectLeader(project)){
                    return true;
                }else{
                    return false;
                }
            }

            $scope.getProjectIssues = function(id){
                issue.getProjectIssues(id)
                    .then(function(success){
                        $scope.issues = success;
                    }, function(error){
                        console.log(error);
                    });
            };

            $scope.redirect = function(){
                $location.path('/home/home');
            }

            $scope.editProject = function(data){
                project.editProject($routeParams.id, data)
                    .then(function(success){
                        console.log(success);
                    }, function(error){
                        console.log(error);
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
                        console.log(success);
                    }, function(error){
                        console.log(error);
                    });
            };

            if (identity.getToken()) {

                project.getProjects()
                    .then(function(responce){
                        $scope.projects = responce;
                    });

                if ($routeParams.id) {
                    project.getProjectById($routeParams.id)
                        .then(function(success){
                            $scope.project = success;
                            $scope.isTeamLeader = $scope.isTeamLeader($scope.project);
                            $scope.getProjectIssues($scope.project.Id);

                        }, function (error) {
                            console.log(error);
                        })
                }
            }
        }
    ])