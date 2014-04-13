'use strict';

var PollApp = angular.module('PollApp');

PollApp
  .controller('CreatePollCtrl', function ($scope, $http) {

  	$scope.poll = {
  		question:"",
  		choices: [],
  		created: new Date(),
          expires: new Date().setDate(new Date().getDate()+7)
  	};

  	// Placeholder for adding choices
  	$scope.newChoice="";
  	$scope.numChoices=0;

    $scope.key;

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
          console.log(data)
	  		})
	  		.error( function(err){

	  		});
  	}
  });
