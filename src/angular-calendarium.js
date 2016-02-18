(function () {
    'use strict';

    var _template = ['<div class="calendarium-container">',
                            '<div class="calendarium" ng-hide="loading">',
                                '<div class="header">',
                                    '<div class="container">',
                                        '<button class="previous" ng-click="previousMonth()" title="previous month" ><</button>',
                                        '<div>{{monthLabel}} / {{yearLabel}}</div>',
                                        '<button class="next" ng-click="nextMonth()" title="next month">></button>',
                                    '</div>',
                                '</div>',
                                '<ol class="calendarium-day-names">',
                                    '<li ng-repeat="weekDay in weekDays">{{weekDay[day_label]}}</li>',
                                '</o>',
                                '<ol class="calendarium-days">',
                                    '<li ng-repeat="dateContainer in dateContainers" title="{{dateContainer.state.tooltip}}">',
                                        '<div ng-if="dateContainer.state.disabled" class="date disabled" ng-class="dateContainer.state.className">{{dateContainer.date.getDate()}}</div>',
                                        '<div ng-if="!dateContainer.state.disabled && !isDate(dateContainer.date)" class="date empty"></div>',
                                        '<div ng-if="!dateContainer.state.disabled && isDate(dateContainer.date)" ng-class="dateContainer.state.className" class="date" ng-click="selectDate(dateContainer.date,dateContainer.state)">{{dateContainer.date.getDate()}}</div>',
                                    '</li>',
                                '</ol>',
                            '</div>',
                            '<div class="showbox" ng-show="loading">',
                                '<div class="loading">',
                                    'loading...',
                                '</div>',
                            '</div>',
                        '<div>'].join("");

    angular.module('ngCalendarium', [])
        .constant('calendarConfig', {
            template:   _template,
            default_day_label: 'abbr',
            day_labels: [   
                            {
                                full: 'Sunday',
                                day: 'Sun',
                                abbr: 'S'
                            },
                            {
                                full: 'Monday',
                                day: 'Mon',
                                abbr: 'M'
                            },
                            {
                                full: 'Tuesday',
                                day: 'Tue',
                                abbr: 'T'
                            },
                            {
                                full: 'Wednesday',
                                day: 'Wed',
                                abbr: 'W'
                            },
                            {
                                full: 'Thursday',
                                day: 'Thu',
                                abbr: 'T'
                            },
                            {
                                full: 'Friday',
                                day: 'Fri',
                                abbr: 'F'
                            },
                            {
                                full: 'Saturday',
                                day: 'Sat',
                                abbr: 'S'
                            }
                        ],
            month_labels: ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September','October', 'November', 'December'],
            days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        })
		.factory('_', ['$window', function($window) {
		  	return $window._; // assumes underscore has already been loaded on the page
		}])
        .service('calendariumService', ['calendarConfig', '$http', '$q', function(calendarConfig, $http, $q){
            
            var self = this;

            self.getDateIntervals = function(year, month){
            	var firstDate = new Date(year, month, 1),
            		lastDate,
                    totalDaysInMonth,
                    days = [];

                totalDaysInMonth = calendarConfig.days_in_month[month];

                if (month === 1) { // February only!
                  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0){
                    totalDaysInMonth += 1;
                  }
                }

                for (var i = 1; i <= totalDaysInMonth; i++) {
                    days.push(i);
                }

                lastDate = new Date(year, month, days.length);

                return {
                    firstWeekDate: firstDate.getDay(), // 0 = Sunday, 1 = Monday ....
                    firstDate: firstDate,
                    lastDate: lastDate,
                    days: days
                };
            };

            self.loadCalendarDates = function(url, year, month, params){
            	var deferred = $q.defer();

            	if(!url) {
            		deferred.resolve(self.getDateIntervals(year, month));
            		return deferred.promise();
            	}

        		var dateIntervals = self.getDateIntervals(year,month);

        		return $http({
				    url: url, 
				    method: "GET",
				    params: angular.extend({
				    	firstDate: dateIntervals.firstDate.toISOString(),
				    	lastDate: dateIntervals.lastDate.toISOString()
				    }, params || {})
			 	}).then(function (response) {
			 		var result = angular.extend({
			 			dates:  response.data
			 		}, dateIntervals); //extend result, appending 'dates'

        			return result;
			  	}, function (response) {
		 			throw response;
			  	});
            };

        }])
        .directive('calendarium', ['$parse', 'calendarConfig','calendariumService', '_', function ($parse, calendarConfig, calendariumService, _) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    month: '@',                  
                    year: '@',
                    onDateSelected:'&',
                    url: '@',
                    params: '='
                },
                template: calendarConfig.template,
                link: function (scope) {
                    var onDateSelectedHandler = scope.onDateSelected();

                    scope._year = (scope.year === null || isNaN(scope.year)) ? new Date().getFullYear() : scope.year;
                    scope._month = (scope.month === null || isNaN(scope.month)) ? new Date().getMonth() : scope.month;

                    scope.weekDays = calendarConfig.day_labels;
                    scope.day_label = calendarConfig.default_day_label;

                    scope.isDate = function(data){
                        return data instanceof Date;
                    };

                    scope.selectDate = function (date,state) {
                    	if(onDateSelectedHandler){
                        	onDateSelectedHandler(date, state);
                    	}
                    };

                    scope.previousMonth = function(){
                        if(scope._month === 0){
                            scope._month = 11;
                            scope._year = scope._year-1;
                        }
                        else
                            scope._month = scope._month-1;

                        scope.render();
                    };

                    scope.nextMonth = function(){
                        if(scope._month === 11){
                            scope._month = 0;
                            scope._year = scope._year+1;
                        }
                        else
                            scope._month = scope._month+1;
                    
                        scope.render();
                    };

                    scope.render = function(){
                    	scope.loading = true;

                        calendariumService.loadCalendarDates(scope.url, scope._year, scope._month, scope.params)
                        	.then(function (dateIntervals){

		                        scope.monthLabel = calendarConfig.month_labels[dateIntervals.firstDate.getMonth()];
		                       
		                        scope.yearLabel = dateIntervals.firstDate.getFullYear();
		      
		                        scope.dateContainers = [];
								_.each(dateIntervals.days, function(day) {
		                        	var calendarDate = {
		                        		date: new Date(dateIntervals.firstDate.getFullYear(), dateIntervals.firstDate.getMonth(), day),
		                        		state: _.findWhere(dateIntervals.dates, {day: day}) || { disabled: false }
		                        	};
		                           
		                            scope.dateContainers.push(calendarDate);
		                        });

		                        //insert null dateContainers to adjust the weekdays position at the beginning
		                        if(dateIntervals.firstDate.getDay() !== 0)
		                            for (var c = 0; c < dateIntervals.firstDate.getDay(); c++) 
		                                scope.dateContainers.unshift({
			                        		date: c,
			                        		state: { disabled: false }
			                        	});

		                        //insert null dateContainers to adjust the weekdays position at the end
		                        if(scope.dateContainers.length % 7 !== 0)
		                        {
		                            var mod = scope.dateContainers.length % 7;
		                            for (var m = 0; m < 7-mod; m++) 
		                                scope.dateContainers.push({
			                        		date: m,
			                        		state: { disabled: false }
			                        	});
		                        }
		                        
                    			scope.loading = false;

	                    	}, function(response){
                    			scope.loading = false;
	                    		throw response;
	                    	});
                        
                    };

                    scope.render();

                }
            };

        }]);

})();


