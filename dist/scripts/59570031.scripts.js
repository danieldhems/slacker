"use strict";(function(){var a=angular.module("PollApp",["ngRoute"]);a.config(["$routeProvider",function(a){a.when("/polls/:pollID/:pollQuestion",{templateUrl:"views/poll.html",controller:"PollCtrl"}).when("/polls",{templateUrl:"views/poll.html",controller:"PollCtrl"}).when("/polls/new",{templateUrl:"views/poll-create.html",controller:"CreatePollCtrl"}).otherwise({redirectTo:"/"})}])}).call(this);var PollApp=angular.module("PollApp");PollApp.filter("dashString",function(){return function(a){return a.toLowerCase().replace(/\s/g,"-").replace(/\?/g,"")}}).controller("PollCtrl",["$scope","$http","$routeParams",function(a,b,c){a.poll={},a.archive=[],a.hasVoted=!1,a.hasClosed=function(){return a.poll.expires<=moment().toISOString()},a.canVote=function(){return void 0!==a.poll?!a.hasVoted&&!a.hasClosed():void 0},a.timeRemaining=function(){return moment(a.poll.expires).calendar()},a.fetchPolls=function(){var d=c.pollID||"";b.get("/polls/"+d).success(function(b){void 0===b.length?a.poll=b:1==b.length?a.poll=b[0]:(a.poll=b.shift(),b.map(function(b){a.archive.push(b)}))}).error(function(a){console.log(a)})},a.fetchPolls(),a.vote=function(c){a.poll.choices[c].votes++;var d={pollID:a.poll._id,choiceID:a.poll.choices[c]._id};b.put("/polls/vote",d).success(function(){a.hasVoted=!0}).error(function(a){console.log(a)})}}]);var PollApp=angular.module("PollApp");PollApp.controller("CreatePollCtrl",["$scope","$http",function(a,b){a.poll={question:"",choices:[],created:moment(),expires:null},a.newChoice="",a.numChoices=0,a.pollSubmitted=!1,a.addChoice=function(b){13==b.keyCode&&(a.poll.choices.push({text:a.newChoice,votes:0}),a.newChoice="",a.numChoices++)},a.removeChoice=function(b){a.poll.choices.splice(b,1)};var c=moment().add("hours",1),d=moment().add("days",1),e=moment().add("weeks",1);a.setDuration=function(b){switch(b){case"hour":a.poll.expires=c;break;case"day":a.poll.expires=d;break;case"week":a.poll.expires=e;break;default:a.poll.expires=c}},a.savePoll=function(){a.setDuration(a.duration),b.post("/polls/new",a.poll).success(function(){a.pollSubmitted=!0}).error(function(a){console.log(new Error(a))})}}]);