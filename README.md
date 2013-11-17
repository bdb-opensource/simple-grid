# simple-grid


A simple grid (editable table) for AngularJS.

Why another grid?

* Pure angular, no other dependencies.
* Works 'angular way' (model binding, form controllers, etc.) to make it natural for integration in an angular app.
* Easy to customize - use css with angular's form classes (`ng-invalid`, etc.) - or just copy & change the template html from the source.


## Quick start

Add these to your `html`:

Template:

    <!-- should be below where you declare ng-app in your html -->
    <script type="text/ng-template" id="simple-grid.html" src="path/to/simple-grid.html"></script>
    
Javascript:

    <script src="path/to/simple-grid.js"></script>

CSS (optional):

    <link rel="stylesheet" href="path/to/simple-grid.css" />


Then, somewhere in your angular app:

View:

    ...
    <div simple-grid="myGridConfig"></div>
    ...
    
Controller:

    ...
    $scope.myGridConfig = {
        // 'rows' should point to your data
        rows: [{ age: 3, name: 'star' }, 
               { age: 2, name: 'sparky' }], 
               
        options: { 
            showDelete: true,
            columns: [{ field: 'age', inputType: 'number' }, 
                      { field: 'name' }]
        }
    }
    ...


## Options Reference

Hopefully up-to-date in respect to the source.


    $scope.myGridConfig = {
        rows: [{ age: 3 }, { age: 5 }], // should point to your data
        options: {
            columns: [
                {
                    field: 'age',
                    
                    title: 'Age', // optional, default is field with first letter capitalized
                    inputType: 'number', // optional, default = text
                    required: false, // optional, default = false
                    disabled: false // optional, default = false
                },
                // ...more columns
            ],
            
            // optional - will show a 'delete' button at the end of each row
            showDelete: true, 
            
            // optional - callbacks for actions on rows
            deleted: function (row) { console.log('deleted:', row); },
            focused: function (row, column) { console.log('focused:', row, column); }
        }
    }
    ...

See the `demo` directory in the source for a full demo.

