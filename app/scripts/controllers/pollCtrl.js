'use strict';

angular.module('sitesApp')
	.controller('PollCtrl', function ($scope, $http) {
		/***
  	*
  	*	Fetch poll
  	*
  	***/

  	$scope.fetchPoll = function(){

  		$scope.poll;

  		// Number of choice voted for
  		$scope.choice;

			$http.get('/polls')
				.success( function(data){
					$scope.poll = data;

					// transform question to URI friendly format for use as REST param
					$scope.poll.name = $scope.poll.question.toLowerCase().split(" ").join("-").replace(/\?/g,"");
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
				poll: $scope.poll._id,
				choice: $scope.poll.choices[choice].text
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


	})
  .controller('CreatePollCtrl', function ($scope, $http) {

  	$scope.poll = {
  		question:"",
  		choices: [],
  		created: new Date()
  	};

  	// Placeholder for adding choices
  	$scope.newChoice="";
  	$scope.numChoices=0;

  	// Add choice to list
  	$scope.addChoice = function(){
  		$scope.poll.choices.push({ text: $scope.newChoice, votes: 0});
  		$scope.newChoice="";
  		$scope.numChoices++;
  	}
  	// Remove choice from list
  	$scope.removeChoice = function(i){
  		$scope.poll.choices.splice(i,1);
  	}

  	// Save poll to DB
  	$scope.savePoll = function(){

  		$http.post('/polls/new', $scope.poll)
	  		.success( function(data){

	  		})
	  		.error( function(err){

	  		});
  	}
  });
