'use strict';
(function(){


    var PollApp = angular.module('PollApp', ['ngRoute']);
    PollApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            // Would want to pass name or ID here, either for title or viewing old polls
            .when('/polls/:pollID/:pollQuestion', {
                templateUrl: 'views/poll.html',
                controller: 'PollCtrl'
            })
            .when('/polls', {
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
    }]);

    var socket = io.connect('http://localhost:9000/');
    socket.on('vote', function(data){
        console.log(data);
    })

}.call(this));
