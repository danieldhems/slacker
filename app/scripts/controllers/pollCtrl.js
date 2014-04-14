'use strict';

var PollApp = angular.module('PollApp');

PollApp
	.filter('dashString', function(){
		return function(string){
			return string.toLowerCase().replace(/\s/g,"-").replace(/\?/g, "");
		}
	})
	.controller('PollCtrl', function ($scope, $http, $routeParams) {

		// Poll currently in play, populated after successful fetch from DB
		$scope.poll = {};
		// Historic polls that can be viewed for results, but no longer acted upon
		$scope.archive=[];
		// Flag wheher user has voted yet
		$scope.hasVoted = false;

		$scope.hasClosed = function(){
			return $scope.poll.expires <= moment().toISOString();
		}

		// Check if user can vote
		$scope.canVote = function(){
			if($scope.poll === undefined) return;
			// verify that user hasn't yet vgoted, and that poll has not yet finished
			return !$scope.hasVoted && !$scope.hasClosed();
		}

		$scope.timeRemaining = function(){
			return moment($scope.poll.expires).fromNow(true);
		}

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

  		var pollID = $routeParams.pollID || "";

			$http.get('/polls/' + pollID)
				.success( function(data){

					// Requests with a pollID param return a single object,
					// whereas those without return a nested object
					// so we have to check for lengths that are both undefined and 1
					// if only 1 poll exists

					if(data.length===undefined){

						$scope.poll = data;
					} else if (data.length==1){

						$scope.poll = data[0];
					} else {

						// Populate poll with latest entry (assuming results array has latest poll as first item!)
						$scope.poll = data.shift();

						// put the rest in the archive array
						data.map( function(poll){
							 $scope.archive.push(poll);
						});
					}
				})
				.error( function(err){
					console.log(err);
				})
		}

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
					// Set this to true to toggle vote buttons with results in view
					$scope.hasVoted = true;
				})
				.error( function(err){
					console.log(err);
				})
		}
	});
