var youTubeApp = angular.module('youTubeApp', ['ngRoute']);

controllers = {};

controllers.YouTubeController = function setVideos($scope, $http) {
	$scope.$on('$viewContentLoaded', function() {
		// this should be the work of a words controller
		for (var i = 0; i < 10; i++) {	
			var randomNum = Math.floor(Math.random() * SIMPLE_WORDS.length);
			var $word = $("<h2>", {class: "word", text: SIMPLE_WORDS[randomNum]}).draggable({
				helper: "clone",
				appendTo: ".drop-words-here",
			});
			$word.appendTo(".words-list");
		}

		$scope.chosenWords = [];
		var chosenWords = $scope.chosenWords;

		// this should be the work of a search box controller (which should be an object with an array of words that gets the new content (a new Word object?) pushed in on the drop event.)
		$(".drop-words-here").droppable({
			accept: ".word",
			activate: function(event, ui) {
				$(this).css("border","3px solid #6cf");
			},
			deactivate: function(event, ui) {
				$(this).css("border","none");
			},
			drop: function(event, ui) {
				// x to append
				var $ximg = $("<img>", {src: "images/x.png", class: "x-img"});

				// append word
				$(this).append($(ui.draggable).clone().css("cursor","default").append($ximg));
				var word = $(ui.draggable).text();
				chosenWords.push(word);

				// handle x click
				$ximg.click(function(){ 
					var word = $(this).parent().text();
					chosenWords = chosenWords.filter(function(ele) {
						return ele !== word;
					});
					$(this).parent().remove();
				});
			},
		});

		$(".let-the-games-begin").on("submit", function(event) {
			event.preventDefault();
			if (chosenWords.length < 1) {
				alert("ERROR: no words selected for search");
			}
			else {
				$http({
					method: "POST",
					url: "/search", 
					data: "data=" + chosenWords.join(" "),
					headers: {"Content-Type": "application/x-www-form-urlencoded"},
				})
				.then(function(response) {
					console.log("query:",chosenWords);
					console.log("success:",JSON.stringify(response.data));
				}, function(response){
					console.log("error:", response)
				});
			}
		});
	})

		// this should be a property of a results controller that gets created based on the AJAX result.
	$scope.videos = [
		{title: 'Holiday/Wedding Makeup Tutorial', id: 'Xc6R4EIR_lk', views: 13945},
		{title: 'Holiday ootd | one year wedding anniversary | plus concert ootd', id: 'w8aFmmNweiw', views: 77},
		{title: 'Maroon 5 - Sugar', id: '09R8_2nJtjg', views: 860962173}
  ]; 
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