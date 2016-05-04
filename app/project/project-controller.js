'use strict';

angular.module('IssueTracker.project', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/projects/:id', {
            templateUrl: 'app/project/project-with-issues.html',
            controller: 'ProjectController'
        });
        $routeProvider.when('/projects/:id/edit', {
            templateUrl: 'app/project/project.html',
            controller: 'ProjectController'
        });
        $routeProvider.when('/projects', {
            templateUrl: 'app/project/projects.html',
            controller: 'ProjectController'
        });
    }])

    .factory('projects', ['$q','requester', 'identity', function($q, requester, identity){
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
            console.log(data);
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
        'projects',
        function ($scope, $location, $routeParams, issue, identity, projects) {

            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.userId = identity.getId();

            $scope.isCurrentUserProjectLeader = function(currentProject){
                if(currentProject.Lead.Id == identity.getId()){
                    $scope.isProjectLeader = true;
                }else{
                    $scope.isProjectLeader = false;
                }
            };

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
                console.log($routeParams.id);
                console.log(data);
                projects.editProject($routeParams.id, data)
                    .then(function(success){
                        console.log(success);
                    }, function(error){
                        console.log(error);
                    })
            };


            if (angular.isDefined(identity.getToken())) {

                projects.getProjects()
                    .then(function(responce){
                        $scope.projects = responce;
                    });

                if ($routeParams.id) {
                    projects.getProjectById($routeParams.id)
                        .then(function(success){
                            $scope.project = success;

                            $scope.isCurrentUserProjectLeader($scope.project);

                            $scope.getProjectIssues($scope.project.Id);

                            $scope.isCurrentUserProjectTeamLeaderOrAdmin = function(){
                                if($scope.project.Lead.Id === $scope.userId || identity.isAdmin()){
                                    return true;
                                }else{
                                    return false;
                                }
                            }

                        }, function (error) {
                            console.log(error);
                        })
                }
            }
        }
    ])