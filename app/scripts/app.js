'use strict';
(function(){


    var PollApp = angular.module('PollApp', []);
    PollApp.config(function ($routeProvider) {
        $routeProvider
            // Would want to pass name or ID here, either for title or viewing old polls
            .when('/polls/view/:pollName', {
                templateUrl: 'views/poll.html',
                controller: 'PollCtrl'
            })
            .when('/polls/new', {
                templateUrl: 'views/poll-create.html',
                controller: 'CreatePollCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

}.call(this));
