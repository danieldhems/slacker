'use strict';
(function(){


    var app = angular.module('sitesApp', []);
    app.config(function ($routeProvider) {
        $routeProvider
            // Would want to pass name or ID here, either for title or viewing old polls
            .when('/polls:name', {
                templateUrl: 'views/poll.html',
                controller: 'PollCtrl'
            })
            .when('/polls/new', {
                templateUrl: 'views/poll-create.html',
                controller: 'CreatePollCtrl'
            })
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

}.call(this));
