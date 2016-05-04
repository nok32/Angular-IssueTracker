'use strict';

angular.module('IssueTracker.label', [])

    .factory('label', [
        'requester',
        'identity',
        function(requester, identity){
            function getLabels(filter){
                var url = 'Labels/?filter=';

                return requester.get(url, identity.getHeaderWithToken());
            }

            return {
                getLabels: getLabels
            };
    }]);