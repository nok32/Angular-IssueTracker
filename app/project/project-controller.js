'use strict';

angular.module('IssueTracker.project', [])

    .config(['$routeProvider', function($routeProvider) {
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

        return {
            getProjects: getProjects,
            getProjectById: getProjectById,
            getMyProjects: getMyProjects,
            editProject: editProject
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
        function ($scope, $location, $routeParams, issue, identity, project) {

            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.userId = identity.getId();

            $scope.isAdmin = identity.isAdmin();

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

            if (identity.getToken()) {

                project.getProjects()
                    .then(function(responce){
                        $scope.projects = responce;
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