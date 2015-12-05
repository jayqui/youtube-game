var youTubeApp = angular.module('youTubeApp', ['ngRoute']);

youTubeApp.factory("QueryFactory",function() {
	var obj = {};
	obj.chosenWords = [];
	obj.alertWords = function() {
		if (obj.chosenWords.length > 0) {
			alert("obj.chosenWords:" + obj.chosenWords);
		} else {
			alert("no words chosen yet");
		}
	}
	obj.clearChosenWords = function() {
		// alert("The words have been:" + obj.chosenWords + "but now clearing list of chosen Words!")
		obj.chosenWords = [];
	}
	return obj;
});
youTubeApp.factory("VideoFactory",function() {
	var obj = {};
	obj.videos = [];
	obj.medianViews = function() {
		if (obj.videos.length > 1) {		
			var sorted = obj.videos.sort(function(a,b) {return a.views - b.views})
			var half = Math.floor(sorted.length/2);
			if (sorted.length % 2 == 0) {
				return (sorted[half-1].views + sorted[half].views)/2
			}
			else {
				return sorted[half].views
			}
		}
	}
	obj.clearVideos = function() {
		// if (obj.videos.length > 0)
			// alert("The videos have included:" + obj.videos[0].title + "but now clearing list of videos!")
		obj.videos = [];
	}
	return obj;	
})

controllers = {};

controllers.YouTubeController = function setVideos($scope, $http, QueryFactory, VideoFactory) {

	var clearFactoriesIfBackButton = function() {
		// Note: there's a script in the `introduction` partial that changes $input.val() to 'yes' every (first) time that partial is visited
		var $input = $('#did-user-hit-back-button');
    // alert("$input.val():" + $input.val())
		if ($input.val() == 'yes') {
			QueryFactory.clearChosenWords();
			VideoFactory.clearVideos();
			$input.val('no');
		}
	}
 	
	clearFactoriesIfBackButton();
	$scope.chosenWords = QueryFactory.chosenWords;
	$scope.videos = VideoFactory.videos;
	$scope.median = VideoFactory.medianViews();

  var prepareResultsForDisplay = function(results) {
  	results.map(function(result) {
  		result.id = result.url.replace("https://www.youtube.com/watch?v=","");
  		delete result.url;
  		return result;
  	})
		results.forEach(function(result){
			$scope.videos.push(result)
		});
		window.location.href = "#/game";
  }

	$scope.$on('$viewContentLoaded', function() {
		// I think this should be the work of a words controller
		for (var i = 0; i < 10; i++) {	
			var randomNum = Math.floor(Math.random() * SIMPLE_WORDS.length);
			var $word = $("<h2>", {class: "word", text: SIMPLE_WORDS[randomNum]}).draggable({
				helper: "clone",
				appendTo: ".drop-words-here",
			});
			$word.appendTo(".words-list");
		}

		// I think this should be the work of a search box controller (which should be an object with an array of words that gets the new content (a new Word object?) pushed in on the drop event.)
		$(".drop-words-here").droppable({
			accept: ".word",
			tolerance: "touch",
			activate: function(event, ui) {
				$(this).css("border","3px solid #6cf");
			},
			deactivate: function(event, ui) {
				$(this).css("border","none");
			},
			drop: function(event, ui) {
				// x to append
				var $ximg = $("<img>", {src: "images/x.png", class: "x-img"});

				// append word and x image
				$(this).append($(ui.draggable).clone().css("cursor","default").append($ximg));
				var word = $(ui.draggable).text();
				$scope.chosenWords.push(word);

				// handle x click
				$ximg.click(function(){ 
					var word = $(this).parent().text();
					$scope.chosenWords = $scope.chosenWords.filter(function(ele) {
						return ele !== word;
					});
					QueryFactory.chosenWords = $scope.chosenWords;
					$(this).parent().remove();
				});
			},
		});

		var errorMessage = function(message) {
			if ($(".progress-bar-pane").is(":visible")) {
				$(".progress-bar-pane").hide();
			}
			$(".message-pane").text(message);
			$(".message-pane").show();
		}
		var showProgressBar = function() {
			if ($(".message-pane").is(":visible")) {
				$(".message-pane").hide();
			}
			$(".progress-bar-pane").show();
		}

		$(".let-the-games-begin").on("submit", function(event) {
			event.preventDefault();
			if ($scope.chosenWords.length < 1) {
				errorMessage("ERROR: no words selected for search.");
			}
			else {
				// progress bar
				$(".progress-bar-pane").progressbar({
					value: false,
				});
				$(".progress-bar-pane").find(".ui-progressbar-value").css({background: "#E52D27"});
				showProgressBar();

				// AJAX request to search YouTube
				$http({
					method: "POST",
					url: "/search", 
					data: "data=" + $scope.chosenWords.join(" "),
					headers: {"Content-Type": "application/x-www-form-urlencoded"},
				})
				.then(function(response) {
					console.log("query:",$scope.chosenWords);
					console.log("success:",JSON.stringify(response.data));
					prepareResultsForDisplay(response.data);
				}, function(response){
					$(".progress-bar-pane").hide();
					errorMessage("Something went wrong. Please try again.");
					console.log("error:", response)
				});
			}
		});
	})
};

youTubeApp.controller(controllers);

youTubeApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'YouTubeController',
			templateUrl: 'js/partials/introduction.html'
		})
		.when('/game', {
			controller: 'YouTubeController',
			templateUrl: 'js/partials/game.html'
		})
		.when('/high-scores', {
			controller: 'YouTubeController',
			templateUrl: 'js/partials/high-scores.html'
		})
		.otherwise({ redirectTo: '/' });
});