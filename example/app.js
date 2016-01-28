angular.module('app', ['ngCalendarium'])
	.controller('appController', ['$scope', function ($scope) {
		$scope.dayClickEvent = function(date){
			alert(date);
		};
    }]);