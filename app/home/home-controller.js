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

    .controller('HomeController', [
        '$scope',
        '$location',
        'requester',
        'identity',
        function($scope, $location, requester,identity){

            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.redirect = function(){
                $location.path('/user/login');
            };

            $scope.getMyIssues = function(){
                var url = 'Issues/me?pageSize=' + 10 +'&pageNumber=' + 5 + '&orderBy=title';
                var header = {
                    headers:{
                        Authorization: 'Bearer ' + identity.getToken()
                    }
                }


                requester.get(url, header)
                    .then(function(success){
                        console.log(success);
                        $scope.issues = success.Issues;
                    });
                    //TODO error

            };
            if (angular.isDefined(identity.getToken())) {
                $scope.issues = $scope.getMyIssues() ;
            }

        }]);