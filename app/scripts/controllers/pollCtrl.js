'use strict';

var PollApp = angular.module('PollApp');

PollApp
	.controller('PollCtrl', function ($scope, $http, $routeParams, StringService) {

		/***
  	*
  	*	Fetch poll
  	*
  	***/

  	$scope.fetchPoll = function(){

			$http.get('/polls/'+$scope.pollName)
				.success( function(data){
					$scope.poll = data;
				})
				.error( function(err){
					console.log(err);
				})
		}

		$scope.fetchPoll();


		// Make vote on poll
		$scope.vote = function(choice){

			$scope.poll.choices[choice].votes++;

			var vote = {
				pollID: $scope.poll["_id"],
				choiceID: $scope.poll.choices[choice]["_id"]
			};

			$http.put('/polls/vote', vote)
				.success( function(data){
					console.log($scope.poll);
				})
				.error( function(err){
					console.log(err);
				})
		}

  	// Get result for poll


	});
