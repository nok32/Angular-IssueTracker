'use strict';
angular.module('IssueTracker.mainController', [])

    .factory('requester', ['$http', '$q', function($http, $q){
        var BASE_URL = 'http://softuni-issue-tracker.azurewebsites.net/';

        function get(url, header) {
            var deferred = $q.defer();

            $http.get(BASE_URL + url, header)
                .success(function(responce){
                    deferred.resolve(responce);
                })
                .error(function(error){
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        function post(url, data, header) {
            var deferred = $q.defer();

            $http.post(BASE_URL + url, data, header)
                .success(function(responce){
                    deferred.resolve(responce);
                })
                .error(function(error){
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        return {
            post: post,
            get: get
        };
    }]);