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
        function($scope, $location, requester,identity){

            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.userId = identity.getId();

            $scope.userName = identity.getUsername();

            $scope.redirect = function(){
                $location.path('/user/login');
            };

            $scope.getMyIssues = function(pageSize, pageNumber, orderByType){
                var url = 'Issues/me?pageSize=' + pageSize +'&pageNumber=' + pageNumber + '&orderBy=' + orderByType;
                var header = {
                    headers:{
                        Authorization: 'Bearer ' + identity.getToken()
                    }
                };

                requester.get(url, header)
                    .then(function(success){
                        $scope.issues = success;
                        $scope.pages = [];
                        for (var i = 0; i <  $scope.issues.TotalPages; i++) {
                            $scope.pages.push(i + 1);
                        }
                        console.log($scope.issues);
                    });
                //TODO error

            };

            if (angular.isDefined(identity.getToken())) {
                $scope.getMyIssues(5, 1, 'DueDate desc');
            }
        }]);