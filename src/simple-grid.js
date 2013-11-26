/*global document: false, angular: false */
(function () {
    'use strict';

    angular.module('simpleGrid', [])
        .directive('simpleGrid', function ($timeout) {
            var gridNum = 0;
            return {
                scope: {
                    simpleGrid: '='
                },

                link: function (scope, elem, attrs) {
                    function initialize() {
                        scope.gridNum = gridNum;
                        gridNum += 1;
                    }
                    
                    scope.isEditable = function () {
                        if (angular.isUndefined(scope.simpleGrid.options.editable)) {
                            return true; // editable by default
                        }
                        return scope.simpleGrid.options.editable || false;
                    };
                    
                    scope.capitalize = function (str) {
                        if (!str) {
                            return str;
                        }
                        return str[0].toUpperCase() + str.slice(1);
                    };

                    scope.toggleDeleted = function (row) {
                        row.$deleted = !(row.$deleted || false);
                        if (row.$deleted && scope.simpleGrid.options && scope.simpleGrid.options.rowDeleted) {
                            scope.simpleGrid.options.rowDeleted(row);
                        }
                    };

                    scope.editRequested = function (row) {
                        if (scope.simpleGrid.options.editRequested) {
                            scope.simpleGrid.options.editRequested(row);
                        }
                    };

                    scope.isInvalid = function (rowIndex) {
                        var formCtrl = scope.$eval(scope.formName(rowIndex));
                        return formCtrl.$error;
                    };

                    scope.keydown = function (event, rowIndex, colIndex) {
                        var elem, elems;
                        switch (event.keyCode) {
                        case 40: //down
                            elem = document.getElementById(scope.formName(rowIndex + 1));
                            break;
                        case 38: //up
                            elem = document.getElementById(scope.formName(rowIndex - 1));
                            break;
                        }
                        if (!elem) {
                            return;
                        }
                        event.preventDefault();
                        elems = elem.getElementsByClassName('sg-column-' + colIndex, angular.element(elem));
                        if (elems.length) {
                            $timeout(function () { elems[0].focus(); });
                        }
                    };

                    scope.getCellText = function (row, column) {
                        var cellValue = row[column.field];
                        if (column.inputType === 'select') {
                            return scope.getOptionTitleByValue(column.options, cellValue);
                        }
                        if (column.formatter) {
                            return column.formatter(cellValue);
                        }
                        return cellValue;
                    };

                    scope.getOptionTitleByValue = function (options, value) {
                        // TODO: Highly ineffecient.
                        // TODO: Array.prototype.filter is not compatible with older browsers
                        var filteredOptions = options.filter(function (option) {
                            return option.value === value;
                        });
                        if (!filteredOptions.length) {
                            // TODO: Write a log indicating that the value was not found.
                            return value;
                        }
                        return filteredOptions[0].title;
                    };

                    scope.selectRow = function (row) {
                        scope.selectedRow = row;
                        if (scope.simpleGrid.options.rowSelected) {
                            scope.simpleGrid.options.rowSelected(row);
                        }
                    };

                    scope.cellFocused = function (row, column) {
                        scope.selectRow(row);
                        if (column && scope.simpleGrid.options.cellFocused) {
                            scope.simpleGrid.options.cellFocused(row, column);
                        }
                    };
                    
                    scope.getOptions = function (options) {
                        if (options.length && angular.isString(options[0])) {
                            // TODO: Not compatible with old browsers
                            return options.map(function (val) { return { value: val, title: scope.capitalize(val) }; });
                        }
                        return options;
                    };

                    scope.formName = function (rowIndex) {
                        return 'simpleGrid' + scope.gridNum.toString() + 'Row' + rowIndex.toString();
                    };

                    scope.isOrderByReverse = function() {
                        if (scope.simpleGrid && !angular.isUndefined(scope.simpleGrid.options.reverseOrder)) {
                            return scope.simpleGrid.options.reverseOrder;
                        }
                        return false;
                    };

                    initialize();
                },

                templateUrl: function (tElement, tAttrs) {
                    return document.getElementById('simple-grid.html').getAttribute('src');
                }
            };
        });
}());
