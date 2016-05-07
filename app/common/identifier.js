'use strict'
angular.module('IssueTracker.identifier', [])

    .factory('identity', [function(){
        function getToken() {
            if(localStorage.getItem('identity')){
                return JSON.parse(localStorage.getItem('identity')).Token;
            }else{
                return false;
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
            }else{
                return false;
            }
        }

        function isAdmin(){
            if(localStorage.identity){
                return JSON.parse(localStorage.getItem('identity')).IsAdmin;
            }else{
                return false;
            }
        }

        function getUsername() {
            if (localStorage.identity) {
                return JSON.parse(localStorage.getItem('identity')).Username;
            }else{
                return false;
            }
        };

        function getId(){
            if (localStorage.identity) {
                return JSON.parse(localStorage.getItem('identity')).Id;
            }else{
                return false;
            }
        }

        function setIdentity(user) {
            localStorage.setItem('identity', JSON.stringify(user));
        };

        function isAuthenticated(){
            if (localStorage.identity) {
                return true;
            }else{
                return false;
            }
        }

        function isCurrentUserProjectLeader(project){
            if(project){
                if(project.Lead.Id === getId()){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
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
            getHeaderWithToken: getHeaderWithToken,
            isCurrentUserProjectLeader: isCurrentUserProjectLeader
        };
    }]);