angular.module('app', ['ngCalendarium'])
	.controller('appController', ['$scope', function ($scope) {
		$scope.dayClickEvent = function(date, state){
			$scope.selectedDate = date;
			$scope.selectedState = state;
		};

		$scope.params = {
			eventId: 1
		};
    }]);