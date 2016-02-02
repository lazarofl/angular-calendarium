angular.module('app', ['ngCalendarium'])
	.controller('appController', ['$scope', function ($scope) {
		$scope.dayClickEvent = function(date,state){
			alert(date);
			alert(state);
		};

		$scope.params = {
			eventId: 1
		};
    }]);