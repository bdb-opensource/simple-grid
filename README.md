# simple-grid


A simple grid (editable table) for AngularJS.

Why another grid?

* Pure angular, no other dependencies.
* Works 'angular way' (model binding, form controllers, etc.) to make it natural for integration in an angular app.
* Easy to customize - use css with angular's form classes (`ng-invalid`, etc.) - or just copy & change the template html from the source.


### [The Demo.](http://bdb-opensource.github.io/simple-grid/demo/index.html) Click it.


## Quick start

### Get the files. 

Either by cloning this git, or using bower:

    bower install angular-simple-grid

### Add them to your `html`.

Template:

    <!-- should be below where you declare ng-app in your html -->
    <script type="text/ng-template" id="simple-grid.html" src="path/to/simple-grid.html"></script>
    
Javascript:

    <script src="path/to/simple-grid.js"></script>

CSS (optional):

    <link rel="stylesheet" href="path/to/simple-grid.css" />

### Add the dependency `simpleGrid`

...to your angular module:

    angular.module('myApp', ['simpleGrid'])


### Then, somewhere in your angular app:

View:

    ...
    <div simple-grid="myGridConfig"></div>
    ...
    
Controller:

    ...
    $scope.myData = [{ age: 3, name: 'star' }, 
                     { age: 2, name: 'sparky' }];
                     
    $scope.myGridConfig = {
        // should return your data (an array)        
        getData: function () { return $scope.myData; }, 
               
        options: { 
            showDelete: true,
            columns: [{ field: 'age', inputType: 'number' }, 
                      { field: 'name' }]
        }
    }
    ...

All set!

## Options Reference

Hopefully up-to-date in respect to the source.


    $scope.myGridConfig = {
        // should return your data (an array)        
        getData: function () { return $scope.myData; }, 

        options: {
            columns: [
                {
                    field: 'species',
                    
                    title: 'Species', // optional, default is field with first letter capitalized
                    inputType: 'number', // optional, default = text. one of: text, number, checkbox, select
                    required: false, // optional, default = false
                    disabled: false // optional, default = false
                    
                    // required if inputType is 'select' - feeds the dropdown
                    // array of objects with {value: , title: } properties
                    // alternative format: array of strings (each will serve as both value and title)
                    options: [{ value: 'f', title: 'flamingo'}, 
                              { value: 'd', title: 'dog'}]
                },
                // ...more columns
            ],
            
            // optional - are the cells in the grid actually editable?
            editable: true,
            
            // optional - if set to 'true' and editable is true, the grid is editable (cells are input controls) but they are all disabled
            disabled: false,
            
            // optional - will show a 'delete' button at the end of each row
            showDeleteButton: false,
            
            // optional - will show an 'edit' button at the end of each row
            showEditButton: false,
            
            // optional - callbacks for actions on rows
            editRequested: function (row) { },
            rowDeleted: function (row) { },
            cellFocused: function (row, column) { },
            rowSelected: function (row) { },
        }
    }
    ...


[See the demo here](http://bdb-opensource.github.io/simple-grid/demo/index.html).

See the `demo` directory in the source for the demo's source, 
