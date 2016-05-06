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

            return requester.get(url, identity.getHeaderWithToken());
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
        'noty',
        'requester',
        'identity',
        'users',
        function ($scope, $location, noty,requester, identity, users) {

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
                    noty.showNoty({
                        text: 'You can not register successfuly, please try again!',
                        ttl: 4000, //time to live in miliseconds
                        type: 'warning', //default, success, warning
                        options: [],
                        optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                            //handling code for options clicked
                        }
                    });
                }else{
                    requester.post(url, data)
                        .then(function(success){
                            noty.showNoty({
                                text: data.email + ', you have register successfuly!',
                                ttl: 4000, //time to live in miliseconds
                                type: 'success', //default, success, warning
                                options: [],
                                optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                    //handling code for options clicked
                                }
                            });
                            $scope.login(user);
                        }, function(error){
                            noty.showNoty({
                                text: 'You can not register successfuly, please try again!',
                                ttl: 4000, //time to live in miliseconds
                                type: 'warning', //default, success, warning
                                options: [],
                                optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                    //handling code for options clicked
                                }
                            });
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
                                user.Username = success.userName;
                                user.Token = success.access_token;

                                identity.setIdentity(user);

                                noty.showNoty({
                                    text: 'Welcome ' + user.Username + ', you have login successfuly!',
                                    ttl: 3500, //time to live in miliseconds
                                    type: 'success', //default, success, warning
                                    options: [],
                                    optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                        //handling code for options clicked
                                    }
                                });
                                $location.path('/alabala');
                            });

                    },function(error){
                        noty.showNoty({
                            text: 'You can not login successfuly, please try again!',
                            ttl: 4000, //time to live in miliseconds
                            type: 'warning', //default, success, warning
                            options: [],
                            optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                                //handling code for options clicked
                            }
                        });
                        console.log(error);
                    })
            }

            $scope.logout = function(){
                noty.showNoty({
                    text: 'You have logout successfuly!',
                    ttl: 3500, //time to live in miliseconds
                    type: 'success', //default, success, warning
                    options: [],
                    optionsCallBack:  function callback(optionClicked, optionIndexClicked) {
                        //handling code for options clicked
                    }
                });

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
