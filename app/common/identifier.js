'use strict'
angular.module('IssueTracker.identifier', [])


    .factory('identity', ['$rootScope', function($rootScope){
        function getToken() {
            if ($rootScope.identity) {
                return $rootScope.identity.token;
            }
        };

        function isAdmin(){
            return $rootScope.identity.isAdmin;
        }

        function getUsername() {
            return $rootScope.identity.username;
        };

        function getId(){
            return $rootScope.identity.Id;
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
            logout: logout
        };
    }]);