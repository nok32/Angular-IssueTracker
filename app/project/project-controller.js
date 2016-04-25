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

    .controller('ProjectController', [
        '$scope',
        '$location',
        '$routeParams',
        'requester',
        'identity',
        function ($scope, $location, $routeParams, requester, identity) {

            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.userId = identity.getId();

            $scope.redirect = function(){
                $location.path('/home/home');
            }

            $scope.getAllProjects = function() {
                var url = 'Projects/?pageSize=10&pageNumber=10&{filter}=Lead';
                var header = {
                    headers:{
                        Authorization: 'Bearer ' + identity.getToken()
                    }
                };

                requester.get(url, header)
                    .then(function(success){
                        $scope.projects = success;
                    }, function (error) {
                        console.log(error);
                    })

            };

            $scope.getProjectById = function(id){
                var url = 'Projects/' + id;
                var header = {
                    headers:{
                        Authorization: 'Bearer ' + identity.getToken()
                    }
                };

                requester.get(url, header)
                    .then(function(success){
                        $scope.project = success;
                        console.log($scope.project);
                    }, function (error) {
                        console.log(error);
                    })

            };

            if (angular.isDefined(identity.getToken())) {
                $scope.projects = $scope.getAllProjects();
                if ($routeParams.id) {
                    $scope.project = $scope.getProjectById($routeParams.id);
                }

            }
        }
    ])