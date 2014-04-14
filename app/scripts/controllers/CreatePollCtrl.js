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

    $scope.pollSubmitted = false;

  	// Add choice to list
  	$scope.addChoice = function($event){
      // Fire when user pressed 'return' key
      if($event.keyCode == 13){
        $scope.poll.choices.push({ text: $scope.newChoice, votes: 0});
        $scope.newChoice="";
        $scope.numChoices++;
      }
  	}
  	// Remove choice from list
  	$scope.removeChoice = function(i){
  		$scope.poll.choices.splice(i,1);
  	}

  	// Save poll to DB
  	$scope.savePoll = function(){

  		$http.post('/polls/new', $scope.poll)
	  		.success( function(data){
          $scope.pollSubmitted = true;
	  		})
	  		.error( function(err){

	  		});
  	}
  });
