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
        'identity',
        function($scope, $location,identity){

            $scope.isAuthenticated = identity.isAuthenticated();

            $scope.redirect = function(){
                $location.path('/user/login');
            };

        }]);