angular.module('IssueTracker.user', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/user/register', {
            templateUrl: 'app/user/user-register.html',
            controller: 'UserController'
        });
        $routeProvider.when('/user/login', {
            templateUrl: 'app/user/user-login.html',
            controller: 'UserController'
        });
        $routeProvider.when('/all-users', {
            templateUrl: 'app/user/all-users.html',
            controller: 'UserController'
        });
    }])

    .controller('UserController', [
        '$scope',
        'requester',
        'identity',
        function ($scope, requester, identity) {

            $scope.register = function(user) {
                var url = 'api/Account/Register';
                var data = {
                    email: user.email,
                    password: user.password,
                    confirmPassword: user.confirmPassword,
                    isAdmin: false
                };

                if (user.password !== user.confirmPassword) {
                    $scope.errorConfirmPassword = 'Confirm Password must be the same like password!'
                }else{
                    requester.post(url, data)
                        .then(function(success){
                            $scope.login(user);
                        }, function(error){
                            console.log(error);
                        });
                }
            };

            $scope.login = function(user){
                var url = 'api/Token';
                var data = "userName=" + encodeURIComponent(user.email) +
                    "&password=" + encodeURIComponent(user.password) +
                    "&grant_type=password";

                var header = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                requester.post(url, data, header)
                    .then(function(success){
                        var user = {
                            Id: success.Id,
                            username: success.userName,
                            token: success.access_token,
                            isAdmin: success.isAdmin
                        };

                        identity.setIdentity(user);
                    },function(error){
                        console.log(error);
                    })
            }

            $scope.getUsers =function(){
                console.log($scope);
                var url = 'Users';
                var header = {
                    headers:{
                        Authorization: 'Bearer ' + identity.getToken()
                    }
                }

                requester.get(url, header)
                    .then(function(success){
                        $scope.allUsers = success;
                        console.log($scope.allUsers);
                    },
                    function(error){
                        console.log(error);
                    })
            };
        }
    ]);
