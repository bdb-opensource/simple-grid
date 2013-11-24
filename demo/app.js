/*global console:false, angular:false */
(function () {
    'use strict';

    angular.module('demo', ['simpleGrid'])
        .controller('MainCtrl', function ($scope) {
            // an example grid config
            $scope.gridConfig = {
                options: {
                    showDeleteButton: true,
                    showEditButton: false,
                    editRequested: function (row) { console.log('edit request:', row); },
                    rowDeleted: function (row) { console.log('deleted:', row); },
                    cellFocused: function (row, column) { console.log('focused:', row, column); },
                    rowSelected: function (row) { console.log('selected:', row); },
                    editable: true, // true is the default
                    disabled: false,
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
                        },
                        {
                            field: 'approved',
                            title: 'Approved?',
                            inputType: 'checkbox'
                        }
                    ]
                },
                getData: function () { return $scope.data; }
            };
            
            $scope.metaGridConfig = {
                options: {
                    editable: true,
                    columns: [
                        {
                            field: 'field',
                            required: true
                        },
                        {
                            field: 'inputType',
                            inputType: 'select',
                            options: ['text', 'number', 'select', 'checkbox']
                        },
                        {
                            field: 'title'
                        },
                        {
                            field: 'required',
                            inputType: 'checkbox'
                        },
                        {
                            field: 'disabled',
                            inputType: 'checkbox'
                        }
                    ]
                },
                getData: function () { return $scope.gridConfig.options.columns; }
            };

            $scope.data = [ { name: 'joe', age: 1, sex: 1, food: 'Milk', approved: false },
                            { name: 'schmo', age: 100, food: 'Steak', approved: true }
                          ];
            // an empty grid: same options, no data.
            $scope.emptyData = [];
            $scope.gridConfigEmpty = { options: $scope.gridConfig.options, getData: function () { return $scope.emptyData; } };

            // utility stuff
            $scope.filterDeleted = function (rows) {
                // TODO: Exteremly inefficient...
                var filtered = rows.filter(function (row) { return !row.$deleted; });
                rows.splice(0, rows.length);
                angular.forEach(filtered, function (item) {
                    rows.push(item);
                });
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
