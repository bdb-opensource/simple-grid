/*global document: false, angular: false */
(function () {
    'use strict';

    angular.module('simpleGrid', [])//['sly'])
        .directive('simpleGrid', function ($timeout, $log) {
            var gridNum = 0;
            return {
                scope: {
                    simpleGrid: '='
                },

                link: function (scope, elem, attrs) {
                    
                    function isEditable(editable) {
                        $log.debug('isEditable');
                        if (angular.isUndefined(editable)) {
                            return true; // editable by default
                        }
                        return editable || false;
                    }
                    
                    function initialize() {
                        scope.gridNum = gridNum;
                        gridNum += 1;
                        
                        scope.page = [];
                        scope.selectedRow = null;
                        scope.focusedRow = null;
                        
                        scope.$watchCollection('simpleGrid.getData()', function (newVal) {
                            scope.data = newVal;
                            scope.updatePage();
                        });
                        
                        scope.$watch('simpleGrid.options.pageSize', scope.updatePage);
                        scope.$watch('simpleGrid.options.pageNum', scope.updatePage);
                        
                        scope.$watch('simpleGrid.options.editable', function (editable) {
                            scope.gridIsEditable = isEditable(editable);
                        });
                        
                        scope.$watch('simpleGrid.options.columns', function (newVal) {
                            angular.forEach(newVal, function (column) {
                                if (column.inputType === 'select') {
                                    column.$options = scope.getOptions(column.options);
                                }
                                column.$title = column.title || scope.capitalize(column.field);
                            });
                        }, true);
                        
                    }
                    
                    scope.updatePage = function () {
                        var i,
                            pageSize,
                            pageStart;
                        scope.page.length = 0;
                        if (!scope.data) {
                            return;
                        }
                        pageSize = scope.simpleGrid.options.pageSize || scope.data.length;
                        pageStart = (scope.simpleGrid.options.pageNum || 0) * pageSize;
                        for (i = pageStart;
                                i < Math.min(pageStart + pageSize,
                                             scope.data.length);
                                i += 1) {
                            scope.page.push(scope.data[i]);
                        }
                    };

                    scope.capitalize = function (str) {
                        $log.debug('capitalize');
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
                        if (scope.simpleGrid.options.perRowEditModeEnabled) {
                            row.$editable = !(row.$editable || false);
                        }
                        if (scope.simpleGrid.options.editRequested) {
                            scope.simpleGrid.options.editRequested(row);
                        }
                    };

                    scope.isInvalid = function (rowIndex) {
                        $log.debug('isInvalid', rowIndex);
                        var formCtrl = scope.$eval(scope.formName(rowIndex));
                        return formCtrl.$error;
                    };

                    scope.keydown = function (event, rowIndex, colIndex) {
                        var elem = null, elems,
                            targetRowIndex = null;
                        switch (event.keyCode) {
                        case 40: //down
                            targetRowIndex = rowIndex + 1;
                            break;
                        case 38: //up
                            targetRowIndex = rowIndex - 1;
                            break;
                        }
                        if (null !== targetRowIndex) {
                            elem = document.getElementById(scope.formName(targetRowIndex));
                        }
                        if (!elem) {
                            return;
                        }
                        event.preventDefault();
                        elems = elem.getElementsByClassName('sg-column-' + colIndex, angular.element(elem));
                        if (elems.length) {
                            $timeout(function () {
                                elems[0].focus();
                            });
                        }
                    };

                    scope.getCellText = function (row, column) {
                        $log.debug('getCellText');//, row, column);
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
                        $log.debug('getOptionTitleByValue');//, options, value);
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

                    scope.toggleRowSelected = function (row) {
                        if (row && row.$selected) {
                            delete row.$selected;
                            scope.selectRow(null);
                        } else {
                            scope.selectRow(row);
                        }
                    };

                    scope.selectRow = function (row) {
                        $log.debug('selectRow', row);
                        if (!scope.simpleGrid.options.allowMultiSelect) {
                            if (scope.selectedRow && scope.selectedRow.$selected) {
                                delete scope.selectedRow.$selected;
                            }
                        }
                        if (!row || row.$deleted) {
                            scope.selectedRow = null;
                            return;
                        }
                        row.$selected = true;
                        scope.selectedRow = row;

                        if (scope.simpleGrid.options.rowSelected) {
                            scope.simpleGrid.options.rowSelected(row);
                        }
                    };

                    scope.setFocusedRow = function (row) {
                        $log.debug('setFocusedRow', row);
                        if (scope.focusedRow === row) {
                            return;
                        }
                        if (scope.focusedRow && scope.focusedRow.$focused) {
                            delete scope.focusedRow.$focused;
                        }

                        if (!scope.gridIsEditable) {
                            if (scope.simpleGrid.options.allowMultiSelect) {
                                scope.toggleRowSelected(row);
                            } else {
                                scope.selectRow(row);
                            }
                            return;
                        }

                        if (row) {
                            row.$focused = true;
                        }
                        scope.focusedRow = row;
                    };

                    scope.cellBlurred = function (row, column) {
                        scope.setFocusedRow(null);
                    };

                    scope.cellFocused = function (row, column) {
                        $log.debug('cellFocused', row, column);
                        scope.setFocusedRow(row);
                        if (!scope.simpleGrid.options.allowMultiSelect) {
                            scope.selectRow(row);
                        }
                        if (column && scope.simpleGrid.options.cellFocused) {
                            scope.simpleGrid.options.cellFocused(row, column);
                        }
                    };
                    
                    scope.getOptions = function (options) {
                        $log.debug('getOptions');//, options);
                        if (options.length && angular.isString(options[0])) {
                            // TODO: Not compatible with old browsers
                            return options.map(function (val) { return { value: val, title: scope.capitalize(val) }; });
                        }
                        return options;
                    };

                    scope.formName = (function () {
                        // memoize
                        var formNames = {};
                        return function (rowIndex) {
                            var existing = formNames[rowIndex];
                            if (!existing) {
                                //$log.debug('formName', rowIndex);
                                existing = formNames[rowIndex] = 'simpleGrid' + scope.gridNum.toString() + 'Row' + rowIndex.toString();
                            }
                            return existing;
                        };
                    }());

                    scope.isOrderByReverse = function () {
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
