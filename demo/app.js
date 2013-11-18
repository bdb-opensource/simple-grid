/*global console:false, angular:false */
(function () {
    'use strict';

    angular.module('demo', ['simpleGrid'])
        .controller('MainCtrl', function ($scope) {
            // an example grid config
            $scope.gridConfig = {
                options: {
                    showDelete: true,
                    rowDeleted: function (row) { console.log('deleted:', row); },
                    cellFocused: function (row, column) { console.log('focused:', row, column); },
                    columns: [
                        {
                            field: 'name',
                            // no inputType -> default is text
                            required: true
                        },
                        {
                            field: 'age',
                            inputType: 'number'
                        },
                        {
                            field: 'sex',
                            inputType: 'select',
                            options: [{ value: 0, title: 'Male'}, { value: 1, title: 'Female'}]
                        },
                        {
                            field: 'food',
                            title: 'Favorite Lunch',
                            inputType: 'text',
                            disabled: true
                        }
                    ]
                },
                rows: [ { name: 'joe', age: 1, sex: 1, food: 'Milk' },
                        { name: 'schmo', age: 100, food: 'Steak' }
                      ]
            };
            
            // an empty grid: same options, no data.
            $scope.gridConfigEmpty = { options: $scope.gridConfig.options, rows: [] };
            
            // utility stuff
            $scope.filterDeleted = function (rows) {
                return rows.filter(function (row) { return !row.$deleted; });
            };
            
            $scope.pretty = function (obj) {
                var filteredObj = angular.copy(obj);
                angular.forEach(filteredObj, function (val, name) {
                    if (name[0] === '$') {
                        delete filteredObj[name];
                    }
                });
                return JSON.stringify(filteredObj, undefined, '    ');
            };
        });

}());
