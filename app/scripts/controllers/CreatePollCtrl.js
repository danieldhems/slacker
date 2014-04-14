'use strict';

var PollApp = angular.module('PollApp');

PollApp
  .controller('CreatePollCtrl', function ($scope, $http) {

  	$scope.poll = {
  		question:"",
  		choices: [],
  		created: moment(),
      expires: null
  	};
console.log(moment())
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

    var hourFromNow = moment().add('hours', 1),
        dayFromNow = moment().add('days', 1),
        weekFromNow = moment().add('weeks', 1);

    $scope.setDuration = function(duration){
      switch(duration){

        case "hour":
        $scope.poll.expires = hourFromNow;
        break;

        case "day":
        $scope.poll.expires = dayFromNow;
        break;

        case "week":
        $scope.poll.expires = weekFromNow;
        break;

        default:
        $scope.poll.expires = hourFromNow;
        break;
      }
    }

  	// Save poll to DB
  	$scope.savePoll = function(){

      // Better UX to set expiration on form submit instead of page load,
      // in case user spends long time on page before submission? 
      $scope.setDuration($scope.duration);

      console.log($scope.poll)

      $http.post('/polls/new', $scope.poll)
        .success( function(poll){
          $scope.pollSubmitted = true;
	  		})
	  		.error( function(err){
          console.log(new Error(err));
	  		});
  	}
  });
