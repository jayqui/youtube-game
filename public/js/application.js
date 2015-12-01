var youTubeApp = angular.module('youTubeApp', ['ngRoute']);

controllers = {};

controllers.YouTubeController = function setVideos($scope) {
	$scope.$on('$viewContentLoaded', function() {
		for (var i = 0; i < 10; i++) {	
			var randomNum = Math.floor(Math.random() * SIMPLE_WORDS.length);
			var $word = $("<h2>", {class: "word", text: SIMPLE_WORDS[randomNum]}).draggable({
				helper: "clone",
				appendTo: ".droppable",
			});
			$word.appendTo(".words-list");
		}
		$(".droppable").droppable({
			accept: ".word",
			activate: function(event, ui) {
				$(this).css("border","3px solid #6cf");
			},
			deactivate: function(event, ui) {
				$(this).css("border","none");
			},
			drop: function(event, ui) {
				var $ximg = $("<img>", {src: "images/x.png", class: "x-img"})
				$ximg.click(function(){ $(this).parent().remove() });
				$(this).append($(ui.draggable).clone().css("cursor","default").append($ximg));
			},
		});
	})
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