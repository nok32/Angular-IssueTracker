angular.module('IssueTracker.user', ['IssueTracker.mainController'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/user/register', {
            templateUrl: 'app/user/user-register.html',
            controller: 'UserController'
        });
        $routeProvider.when('/user/login', {
            templateUrl: 'app/user/user-login.html',
            controller: 'UserController'
        });
    }])

    .controller('UserController', [
        '$scope',
        'requester',
        function ($scope, requester) {

            $scope.login = function(user){
                var url = 'api/Token';
                var data = "userName=" + encodeURIComponent(user.email) +
                    "&password=" + encodeURIComponent(user.password) +
                    "&grant_type=password";

                var header = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }

                requester.post(url, data, header)
                    .then(function(success){
                        var user = {
                            username: success.userName,
                            token: success.access_token
                        };

                        console.log(user);
                    },function(error){
                        console.log(error);
                    })
            }

        }
    ]);
