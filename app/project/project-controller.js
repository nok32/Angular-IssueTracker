'use strict';

angular.module('IssueTracker.project', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/projects/:id', {
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
            var url = 'Projects/?pageSize=100&pageNumber=1&{filter}=Lead';

            var deffered = $q.defer();

            requester.get(url, identity.getHeaderWithToken())
                .then(function(success){
                    deffered.resolve(success);
                },
                function(error){
                    deffered.reject(error);
                });

            return deffered.promise;
        };

        function getProjectById(id){
            var url = 'Projects/' + id;

            var deffered = $q.defer();

            requester.get(url, identity.getHeaderWithToken())
                .then(function(success){
                    deffered.resolve(success);
                },
                function(error){
                    deffered.reject(error);
                });

            return deffered.promise;
        }

        return {
            getProjects: getProjects,
            getProjectById: getProjectById
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
        'requester',
        'identity',
        'projects',
        function ($scope, $location, $routeParams, requester, identity, projects) {

            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.userId = identity.getId();

            $scope.getProjectIssues = function(id){
                var url = 'Projects/' + id + '/Issues';

                requester.get(url, identity.getHeaderWithToken())
                    .then(function(success){
                        console.log(success);
                        $scope.issues = success;
                    }, function(error){
                        console.log(error);
                    });
            };

            $scope.redirect = function(){
                $location.path('/home/home');
            }


            if (angular.isDefined(identity.getToken())) {

                projects.getProjects()
                    .then(function(responce){
                        $scope.projects = responce;
                    })

                if ($routeParams.id) {
                    projects.getProjectById($routeParams.id)
                        .then(function(success){
                            $scope.project = success;

                            console.log($scope.project);

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