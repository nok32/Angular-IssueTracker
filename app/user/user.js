angular.module('IssueTracker.user', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/user/register', {
            templateUrl: 'app/user/user-register.html',
            controller: 'UserRegisterController'
        });
        $routeProvider.when('/user/login', {
            templateUrl: 'app/user/user-login.html',
            controller: 'UserRegisterController'
        });
    }])

    .controller('UserRegisterController',
    [
        '$scope',
        '$http',
        '$q',
        'BASE_URL',
        function UserRegisterController($scope, $http, $q, BASE_URL) {

            $scope.register = function register(user) {
                if (user.password !== user.confirmPassword) {
                    $scope.errorConfirmPassword = 'Confirm Password must be the same like password!'
                }else{
                    var defer = $q.defer();

                    $http.post(BASE_URL + '/api/Account/Register',
                        {
                            email:user.email,
                            password: user.password,
                            confirmPassword: user.confirmPassword
                        }
                    )
                        .success(function(data){
                            defer.resolve(data);
                            console.log(data)
                        })
                        .error(function(error){
                            defer.reject(error);
                            console.log(error)
                        })

                    return defer.promise;
                }
            };

            $scope.login = function login(user) {
                var defer = $q.defer();

                $http.post(BASE_URL + '/api/Token',
                        "userName=" + encodeURIComponent(user.email) +
                        "&password=" + encodeURIComponent(user.password) +
                        "&grant_type=password",
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                )
                    .success(function(data){
                        defer.resolve(data);
                        console.log(data);
                        console.log('You log on + ')
                    })
                    .error(function(error){
                        defer.reject(error);
                        console.log(error)
                    })

                return defer.promise;
            }
        }
    ])