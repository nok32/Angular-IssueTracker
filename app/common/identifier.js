'use strict'
angular.module('IssueTracker.identifier', [])


    .factory('identity', ['$rootScope', function($rootScope){
        function getToken() {
            if($rootScope.identity){
                return $rootScope.identity.Token;
            }
        };

        function getHeaderWithToken(){
            if($rootScope.identity){
                var header = {
                    headers:{
                        Authorization: 'Bearer ' + getToken()
                    }
                };

                return header;
            }
        }

        function isAdmin(){
            return $rootScope.identity.IsAdmin;
        }

        function getUsername() {
            if ($rootScope.identity) {
                return $rootScope.identity.Username;
            }
        };

        function getId(){
            if ($rootScope.identity) {
                return $rootScope.identity.Id;
            }
        }

        function setIdentity(user) {
            $rootScope.identity = user;
        };

        function isAuthenticated(){
            if ($rootScope.identity !== undefined) {
                return true;
            }
            return false;
        }

        function logout(){
            $rootScope.identity = undefined;
        }

        return {
            getToken: getToken,
            setIdentity: setIdentity,
            getUsername: getUsername,
            isAdmin:isAdmin,
            getId: getId,
            isAuthenticated: isAuthenticated,
            logout: logout,
            getHeaderWithToken: getHeaderWithToken
        };
    }]);