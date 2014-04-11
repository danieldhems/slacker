'use strict';

var PollApp = angular.module('PollApp');

PollApp
	.filter('dashString', function(){
		return function(string){
			return string.toLowerCase().replace(/\s/g,"-").replace(/\?/g, "");
		}
	})
	.controller('PollCtrl', function ($scope, $http, $routeParams) {

		$scope.poll;
		$scope.archive=[];

		/***
  	*
  	*	Fetch poll by ID
  	*
  	***/

  	$scope.fetchPoll = function(){

			$http.get('/poll/'+ $routeParams.pollID)
				.success( function(poll){
					$scope.poll = poll;
				})
				.error( function(err){
					console.log(err);
				})
		}

		/***
		*
		*	Fetch all polls
		*
		***/

  	$scope.fetchPolls = function(){

			$http.get('/polls/')
				.success( function(polls){
					$scope.archive = polls;
				})
				.error( function(err){
					console.log(err);
				})
		}

		$scope.fetchPoll();
		$scope.fetchPolls();


		// Make vote on poll
		$scope.vote = function(choice){

			$scope.poll.choices[choice].votes++;

			var vote = {
				pollID: $scope.poll["_id"],
				choiceID: $scope.poll.choices[choice]["_id"]
			};

			$http.put('/polls/vote', vote)
				.success( function(data){
					// Let user know
				})
				.error( function(err){
					console.log(err);
				})
		}

  	// Get result for poll


	});
