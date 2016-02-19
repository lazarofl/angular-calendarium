# Angular-Calendarium [![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/lazarofl/angular-calendarium/blob/master/LICENSE)

A lightweight calendar component using angular directives

![calendarium](https://cloud.githubusercontent.com/assets/913314/12627736/a8d09a50-c526-11e5-9d33-7dea96bf9fd3.PNG) 

## Features

- [x] Navigate through the months using `previous` and `next` month buttons
- [x] Add a `dayClick` callback using `directive attribute`
- [x] Add a default `css` file
- [x] Load data from API to mark dates with a custom css and tooltip

# Getting started/How to use it

Install `angular-calendarium` using `bower`.
```
bower install angular-calendarium --save
```
or download the latest version at [releases page](https://github.com/lazarofl/angular-calendarium/releases)

add `calendarium` directive:
```html
...
<body ng-app="app" ng-controller="appController">
	
	<div>
		<calendarium></calendarium>
	</div>

	<script src="app.js"></script>
</body>
...
```

## Month and year initialization

`angular-calendarium` uses current date by default, but you can change it passing __year__ and __month__ as attribute parameters:

```html
<body ng-app="app" ng-controller="appController">
	
	<div>
		<!-- will render January / 2020 -->
		<calendarium year='2020' month='0'></calendarium>
	</div>

</body>
```

## on-date-selected attribute

You can set a function from another controller using `on-date-selected` attribute:
```html
...
<body ng-app="app" ng-controller="appController">
	
	<div>
		<calendarium on-date-selected='handleDayClick'></calendarium>
	</div>

	<script src="app.js"></script>
</body>
...
```
```javascript
angular.module('app', ['ngCalendarium'])
	.controller('appController', ['$scope', function ($scope) {
		$scope.handleDayClick = function(date, state){
			alert(date);
		};
  }]);
```

## API Request

You can set an API url using `url` attribute:
```html
...
<body ng-app="app" ng-controller="appController">
	
	<div>
		<calendarium on-date-selected='handleDayClick' url="your_url_path"></calendarium>
	</div>

	<script src="app.js"></script>
</body>
...
```

#### Scope parameters

You can pass angular scope parameters to API requests using `params` atribute like below.
Requests are using `GET` method.

```html
...
<body ng-app="app" ng-controller="appController">
	
	<div>
		<calendarium on-date-selected='handleDayClick' params="params" url="your_url_path"></calendarium>
	</div>

	<script src="app.js"></script>
</body>
...
```javascript
angular.module('app', ['ngCalendarium'])
	.controller('appController', ['$scope', function ($scope) {
		$scope.handleDayClick = function(date, state){
			alert(date);
		};
		
		$scope.params = {
			userId: 1,
			customOption: 'ABC'
		};
  }]);
```

`$scope.params` data will be passed as url parameters.

#### API request result

The result must contain a `day object` array.

 - `day` - **required : number**
 - `disabled` - *optional : boolean | default = false*
 - `className` - *optional : string*
 - `tooltip` - *optional : string*

Sample API request result:

```
[
 {
  disabled: true,
  day: 6
 },
 {
  className: "blue",
  day: 10
 },
 {
  disabled: true,
  day: 25
 },
 {
  className: "red",
  day: 28,
  tooltip: "under maintenance"
 },
 {
  disabled: true,
  day: 29
 }
]
```

![image](https://cloud.githubusercontent.com/assets/913314/13160894/92a436da-d681-11e5-843d-7aff9e2001d0.png)

You can pass any other data inside `day object` an retrieve it on `on-date-selected` event as in the [sample page](http://lazarofl.github.io/angular-calendarium/).

```
$scope.dayClickEvent = function(date, state){
	$scope.selectedDate = date;
	$scope.selectedState = state;
};
```

#### CSS Customization

`red` and `blue` class names use the structure below:

```css
.calendarium-days li .blue{
  color: blue;
  font-weight: bold;
}

.calendarium-days li .red{
  color: red;
  font-weight: bold;
}
```

You can overwrite them or create your own `css` classes for `.calendarium-days li` element and pass them to `className` property inside `day object` array.

## Roadmap

- [x] Navigate through the months using `previous` and `next` month buttons
- [x] Add a `dayClick` callback using `directive attribute`
- [x] Add a default `css` file
- [x] Load data from API to mark dates with a custom css and tooltip
- [ ] Add calendar captions support
- [ ] Add i18n support

## How to contribute?

1. Fork it!
2. Run `npm install && bower install` under the project folder
3. Create your feature branch: `git checkout -b my-new-feature`
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to remote branch: `git push origin my-new-feature`
6. Submit a pull request :)


## Gulp taks

Run `gulp` or `gulp default` to:
 - prefix css using `autoprefixer`
 - minify css
 - validate `javascript` code using `jshint`
 - uglify `javascript` code using `uglify`
 - publish `css` and `js` code on `dist` folder

## Support

> Any question? Add it using an [issue](https://github.com/lazarofl/angular-calendarium/issues/new).

## License
Created by and copyright [Lazaro Fernandes Lima Suleiman](https://github.com/lazarofl). Released under the [MIT license](https://github.com/lazarofl/angular-calendarium/blob/master/LICENSE).
