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
                    scope.capitalize = function (str) {
                        if (!str) {
                            return str;
                        }
                        return str[0].toUpperCase() + str.slice(1);
                    };

                    scope.toggleDeleted = function (row) {
                        row.$deleted = !row.$deleted;
                        if (row.$deleted && scope.simpleGrid.options && scope.simpleGrid.options.rowDeleted) {
                            scope.simpleGrid.options.rowDeleted(row);
                        }
                    };

                    scope.editRequested = function(row) {
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
                            event.preventDefault();
                            break;
                        case 38: //up
                            elem = document.getElementById(scope.formName(rowIndex - 1));
                            event.preventDefault();
                            break;
                        }
                        if (elem) {
                            elems = elem.getElementsByClassName('sg-column-' + colIndex);
                            if (elems.length) {
                                $timeout(function () {
                                    elems[0].focus();
                                });
                            }
                        }
                    };

                    scope.getCellText = function(row, column) {
                        var cellValue = row[column.field];
                        if (column.inputType === 'select') {
                            return scope.getOptionTitleByValue(column.options, cellValue);
                        }
                        return cellValue;
                    };

                    scope.getOptionTitleByValue = function(options, value) {
                        return options.filter(function (option) {
                            return option.value === value;
                        })[0].title;
                    };

                    scope.selectRow = function (row) {
                        scope.selectedRow = row;
                    }

                    scope.cellFocused = function (row, column) {
                        scope.selectRow(row);
                        if (column) {
                            scope.simpleGrid.options.cellFocused(row, column);
                        }
                    };

                    scope.formName = function (rowIndex) {
                        return 'simpleGrid' + scope.gridNum.toString() + 'Row' + rowIndex.toString();
                    };

                    scope.gridNum = gridNum;
                    gridNum += 1;

                },

                templateUrl: function (tElement, tAttrs) {
                    return document.getElementById('simple-grid.html').getAttribute('src');
                }
            };
        });
}());