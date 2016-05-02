'use strict'
angular.module('IssueTracker.identifier', [])


    .factory('identity', [function(){
        function getToken() {
            if(localStorage.getItem('identity')){
                return JSON.parse(localStorage.getItem('identity')).Token;
            }
        };

        function getHeaderWithToken(){
            if(localStorage.getItem('identity')){
                var header = {
                    headers:{
                        Authorization: 'Bearer ' + getToken()
                    }
                };

                return header;
            }
        }

        function isAdmin(){
            return JSON.parse(localStorage.getItem('identity')).IsAdmin;
        }

        function getUsername() {
            if (localStorage.identity) {
                return JSON.parse(localStorage.getItem('identity')).Username;
            }
        };

        function getId(){
            if (localStorage.identity) {
                return JSON.parse(localStorage.getItem('identity')).Id;
            }
        }

        function setIdentity(user) {
            localStorage.setItem('identity', JSON.stringify(user));
        };

        function isAuthenticated(){
            if (localStorage.identity) {
                return true;
            }
            return false;
        }

        function logout(){
            localStorage.removeItem('identity');
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