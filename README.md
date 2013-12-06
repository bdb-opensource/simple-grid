# simple-grid


A simple grid (editable table) for AngularJS.

## Features

* Multiple edit modes: all cells editable, per-row editing (each row is read-only until changed to edit mode), or uneditable (just a table)
* Row selection (single or multi-select)
* Keyboard navigation (up/down in a cell move to same cell in next/previous row)
* Paging support
* Dynamically updatable configuration object (columns setup, editing modes, etc. - thanks to Angular!)

Of course, the grid support all input types natively supported by browsers, including all of Angular's special validated input types: text, [checkbox](http://docs.angularjs.org/api/ng.directive:input.checkbox), [number](http://docs.angularjs.org/api/ng.directive:input.number), [url](http://docs.angularjs.org/api/ng.directive:input.url), [email](http://docs.angularjs.org/api/ng.directive:input.email) and also [select](http://docs.angularjs.org/api/ng.directive:select) and [textarea](http://docs.angularjs.org/api/ng.directive:textarea).


## Why another grid?

* Pure angular, no other dependencies.
* Works the 'angular way' (model binding, form controllers, etc.) to make it natural for integration in an angular app.
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

CSS (**optional** - built for Bootstrap 3. You'll probably want to augment or replace it):

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

            // optional, default = false. Relevant only if editable = true.
            // use together with showEditButton, see below.
            perRowEditModeEnabled: false, 

            // optional - if set to 'true' and editable is true, the grid is editable (cells are input controls) but they are all disabled
            disabled: false,
            
            // optional - will show a 'delete' button at the end of each row
            showDeleteButton: false,
            
            // optional - will show an 'edit' button at the end of each row (useful when perRowEditModeEnabled)
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

# Performance Tips

Since Angular's performance [deteriorates when there are too many bindings](http://stackoverflow.com/a/18381836/562906), the grid can become quite slow with as few as 20-30 rows, if using drop-downs (or just a slow browser). 

To work around this issue you can:

* Use paging (see below)
* Use per-row editing mode (the grid will use a lot less bindings, since most of the table will be non-editable)
* Limit the usage of drop-downs
* Use less columns

## Paging

The grid supports paging through the `pageNum` and `pageSize` configuration properties. Currently you have to add the prev/next buttons yourself and wire them up to change the `pageNum` appropriately (see the [demo source](https://github.com/bdb-opensource/simple-grid/tree/master/demo) for an example usage). 

# Contributing

For bugs or suggestions, use [github issues](https://github.com/bdb-opensource/simple-grid/issues).

Otherwise, just send your pull requests!


