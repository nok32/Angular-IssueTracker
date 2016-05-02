'use strict';

angular.module('IssueTracker.home', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/home/home.html',
            controller: 'HomeController'
        });
    }])

    .directive('haveToken', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/home/dashboard.html'
        }
    })

    .directive('user', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/user/user.html'
        }
    })

    .controller('HomeController', [
        '$scope',
        '$location',
        'requester',
        'identity',
        'issue',
        'projects',
        function($scope, $location, requester, identity, issue, projects){

            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.userId = identity.getId();

            $scope.userName = identity.getUsername();

            $scope.redirect = function(){
                $location.path('/user/login');
            };

            $scope.getMyIssues = function(pageSize, page, sorter){
                issue.getMyIssues(pageSize, page, sorter)
                    .then(function(success){
                        $scope.issues = success;
                        $scope.pages = [];
                        for (var i = 0; i <  $scope.issues.TotalPages; i++) {
                            $scope.pages.push(i + 1);
                        }
                    }, function(error){
                        //TODO
                    });
            };

            $scope.getMyProjects = function(pageSize, page, filter){
                projects.getMyProjects(pageSize, page, filter)
                    .then(function(success){
                        $scope.projects =success;
                        $scope.projectsPages = [];
                        for (var i = 0; i <  $scope.projects.TotalPages; i++) {
                            $scope.projectsPages.push(i + 1);
                        }
                    }, function(error){
                        console.log(error);
                    });
            };

            if (angular.isDefined(identity.getToken())) {
                $scope.getMyIssues(5, 1, 'DueDate desc');
                $scope.projectsFilter = 'Lead.Id=' + '"' + identity.getId() + '"';
                $scope.getMyProjects(5, 1, $scope.projectsFilter);
            }
        }]);