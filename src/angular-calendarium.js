(function () {
    'use strict';
    angular.module('ngCalendario', [])
        .constant('calendarConfig', {
            formatDay: 'd',
            showWeeks: true,
            template:   ['<div class="calendarium">',
                            '<h1>{{monthLabel}}/{{yearLabel}}</h1>',
                            '<div class="dates" ng-repeat="date in dates">',
                                '<div ng-if="!isDate(date)" class="date empty"></div>',
                                '<div ng-if="isDate(date)" class="date"><a ng-click="selectDate(date)">{{date.getDate()}}</a></div>',
                            '</div>',
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

                for (var i = 0; i < totalDaysInMonth; i++) {
                    days.push(i+1);
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
                restrict: 'EA',
                replace: true,
                scope: {
                    month: '@',                  
                    year: '@',
                    onDateSelected:'&onDateSelected'               
                },
                template: calendarConfig.template,
                link: function (scope) {
                    var onDateSelectedHandler = scope.onDateSelected();

                    var dateIntervals = calendariumService.processDateIntervals(
                        (scope.year === null || isNaN(scope.year)) ? new Date().getFullYear() : scope.year
                        , (scope.month === null || isNaN(scope.month)) ? new Date().getMonth() : scope.month
                        );

                    scope.dates = [];
                    scope.isDate = function(data){
                        return data instanceof Date;
                    };

                    for (var i = 0; i < dateIntervals.days.length - 1; i++)
                        scope.dates.push(new Date(dateIntervals.firstDate.getFullYear(), dateIntervals.firstDate.getMonth(), dateIntervals.days[i]));

                    //insert null dates to adjust the weekdays position
                    if(dateIntervals.firstDate.getDay() !== 0)
                        for (var c = 0; c < dateIntervals.firstDate.getDay() - 1; c++) 
                            scope.dates.unshift({day: c});

                    scope.dates = scope.dates;

                    scope.selectDate = function (date) {
                        onDateSelectedHandler(date);
                    };

                    scope.monthLabel = calendarConfig.month_labels[dateIntervals.firstDate.getMonth()];
                    scope.yearLabel = dateIntervals.firstDate.getFullYear();
                }
            };

        }]);

})();


