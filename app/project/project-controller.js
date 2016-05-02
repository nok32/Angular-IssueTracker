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
            var userId = identity.getId();
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

        return {
            getProjects: getProjects,
            getProjectById: getProjectById,
            getMyProjects: getMyProjects
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
                    });

                if ($routeParams.id) {
                    projects.getProjectById($routeParams.id)
                        .then(function(success){
                            $scope.project = success;

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