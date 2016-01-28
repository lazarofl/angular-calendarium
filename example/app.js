angular.module('app', ['ngCalendario'])
	.controller('appController', ['$scope', function ($scope) {
		$scope.dayClickEvent = function(date){
			alert(date);
		};
    }]);