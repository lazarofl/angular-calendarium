(function () {
    'use strict';
    angular.module('ngCalendarium', [])
        .constant('calendarConfig', {
            template:   ['<div class="calendarium">',
                            '<div class="header">',
                                '<button class="previous" ng-click="previousMonth()" title="previous month" ><<</button>',
                                '<h1>{{monthLabel}}/{{yearLabel}}</h1>',
                                '<button class="next" ng-click="nextMonth()" title="next month" >>></button>',
                            '</div>',
                            '<ol class="day-names clear">',
                    			'<li ng-repeat="weekDay in weekDays">{{weekDay}}</li>',
                            '</o>',
                            '<ol class="days">',
                                '<li ng-repeat="date in dates">',
                                    '<div ng-if="!isDate(date)" class="date empty"></div>',
                                    '<div ng-if="isDate(date)" class="date" ng-click="selectDate(date)">{{date.getDate()}}</div>',
                                '</li>',
                            '</ol>',
                        '</div>'].join(""),
            day_labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            month_labels: ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September','October', 'November', 'December'],
            days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        })
        .service('calendariumService', ['calendarConfig', function(calendarConfig){
            
            var self = this;

            self.processDateIntervals = function(year, month){

                var firstDate = new Date(year, month, 1),
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

                return {
                    firstWeekDate: firstDate.getDay(), // 0 = Sunday, 1 = Monday ....
                    firstDate: firstDate,
                    days: days
                };

            };

        }])
        .directive('calendarium', ['$parse', 'calendarConfig','calendariumService', function ($parse, calendarConfig, calendariumService) {

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    month: '@',                  
                    year: '@',
                    onDateSelected:'&',
                    url: '@'
                },
                template: calendarConfig.template,
                link: function (scope) {
                    var onDateSelectedHandler = scope.onDateSelected();

                    scope._year = (scope.year === null || isNaN(scope.year)) ? new Date().getFullYear() : scope.year;
                    scope._month = (scope.month === null || isNaN(scope.month)) ? new Date().getMonth() : scope.month;
                    scope.weekDays = calendarConfig.day_labels;

                    scope.isDate = function(data){
                        return data instanceof Date;
                    };

                    scope.selectDate = function (date) {
                    	if(onDateSelectedHandler){
                        	onDateSelectedHandler(date);
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
                        var dateIntervals = calendariumService.processDateIntervals(scope._year, scope._month);

                        scope.monthLabel = calendarConfig.month_labels[dateIntervals.firstDate.getMonth()];
                        scope.yearLabel = dateIntervals.firstDate.getFullYear();
      
                        scope.dates = [];

                        for (var i = 0; i < dateIntervals.days.length; i++)
                            scope.dates.push(new Date(dateIntervals.firstDate.getFullYear(), dateIntervals.firstDate.getMonth(), dateIntervals.days[i]));

                        //insert null dates to adjust the weekdays position at the beginning
                        if(dateIntervals.firstDate.getDay() !== 0)
                            for (var c = 0; c < dateIntervals.firstDate.getDay(); c++) 
                                scope.dates.unshift({day: c});

                        //insert null dates to adjust the weekdays position at the end
                        if(scope.dates.length % 7 !== 0)
                        {
                            var mod = scope.dates.length % 7;
                            for (var m = 0; m < 7-mod; m++) 
                                scope.dates.push({day: m});
                        }
                        
                        scope.dates = scope.dates;
                    };

                    scope.render();

                }
            };

        }]);

})();


