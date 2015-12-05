var youTubeApp = angular.module('youTubeApp', ['ngRoute']);

youTubeApp.factory("QueryFactory",function() {
	var obj = {};
	obj.chosenWords = [];
	obj.addWord = function(word) {
		obj.chosenWords.push(word);
	};
	obj.removeWord = function(word) {
		obj.chosenWords = obj.chosenWords.filter(function(ele) {return ele !== word});
	}
	return obj;
});
youTubeApp.factory("VideoFactory",function() {
	var obj = {};
	obj.videos = [];
	// obj.videos = [{title: "From Tha Factoray", id:"4567", views:"666"}];
	// obj.addVideo = function(videoObj) {
	// 	obj.videos.push(videoObj);
	// };
	// obj.removeVideo = function(videoObj) {
	// 	obj.videos = obj.videos.filter(function(ele) {return ele !== videoObj});
	// }
	return obj;	
})

controllers = {};

controllers.YouTubeController = function setVideos($scope, $http, QueryFactory, VideoFactory) {
 	
 	$scope.videos = VideoFactory.videos;

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

		$scope.chosenWords = [];
		var chosenWords = $scope.chosenWords;


		// I think this should be the work of a search box controller (which should be an object with an array of words that gets the new content (a new Word object?) pushed in on the drop event.)
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
					// console.log("first result:",JSON.stringify(response.data[0]));
					// chosenWords.push(response.data[0]);
					prepareResultsForDisplay(response.data);
				}, function(response){
					alert("something went wrong...");
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