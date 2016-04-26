angular.module('IssueTracker.user', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/all-users', {
            templateUrl: 'app/user/all-users.html',
            controller: 'UserController'
        });
        $routeProvider.when('/logout', {
            templateUrl: 'app/user/user-logout.html',
            controller: 'UserController'
        });
    }])

    .factory('users', ['$q','requester', 'identity', function($q, requester, identity){
        function getUsers(){
            var url = 'Users';
            var header = {
                headers:{
                    Authorization: 'Bearer ' + identity.getToken()
                }
            };

            var deffered = $q.defer();

            requester.get(url, header)
                .then(function(success){
                    deffered.resolve(success);
                },
                function(error){
                    deffered.reject(error);
                });

            return deffered.promise;
        };

        return {
            getUsers: getUsers
        };
    }])

    .directive('login', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/user/user-login.html'
        }
    })

    .directive('register', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/user/user-register.html'
        }
    })

    .controller('UserController', [
        '$scope',
        '$location',
        'requester',
        'identity',
        'users',
        function ($scope, $location,requester, identity, users) {

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

            $scope.login = function(userLogin){
                var url = 'api/Token';
                var data = "userName=" + encodeURIComponent(userLogin.email) +
                    "&password=" + encodeURIComponent(userLogin.password) +
                    "&grant_type=password";

                var header = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                requester.post(url, data, header)
                    .then(function(success){
                        var header = {
                            headers:{
                                Authorization: 'Bearer ' + success.access_token
                            }
                        };
                        var user = {};
                        requester.get('/Users/me', header)
                            .then(function(currentUser){
                                user.Id = currentUser.Id;
                                user.IsAdmin = currentUser.isAdmin;
                            });

                        user.Username = success.userName;
                        user.Token = success.access_token;

                        identity.setIdentity(user);

                        $location.path('/alabala');

                    },function(error){
                        console.log(error);
                    })
            }

            $scope.logout = function(){
                identity.logout();
                $location.path('app/home');
            };

            $scope.getUsers = function(){
                users.getUsers()
                    .then(function(responce){
                        $scope.allUsers = responce;
                    });
            }

        }
    ]);
