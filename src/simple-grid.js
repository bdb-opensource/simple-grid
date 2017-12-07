/*global document: false, angular: false */
(function () {
    'use strict';

    angular.module('simpleGrid', [])//['sly'])
        .directive('simpleGrid', ['$timeout', '$log', function ($timeout, $log) {
            var gridNum = 0;
            return {
                scope: {
                    simpleGrid: '='
                },

                link: function (scope, elem, attrs) {
                    /**
                     * @param {jQuery.event} event
                     * @param {number} targetRowIndex
                     * @param {number} colIndex
                     */
                    function setFocusedCell(event, targetRowIndex, colIndex) {
                        var elem = null, elems;
                        if (null !== targetRowIndex) {
                            elem = document.getElementById(scope.formName(targetRowIndex));
                        }
                        if (!elem) {
                            return;
                        }
                        if (event) {
                            event.preventDefault();
                        }
                        elems = elem.getElementsByClassName('sg-column-' + colIndex, angular.element(elem));
                        if (elems.length) {
                            $timeout(function () {
                                elems[0].focus();
                            });
                        }
                    }

                    function setRowSelected(row, isSelected) {
                        if (isSelected) {
                            row.$selected = true;
                        }
                        else {
                            delete row.$selected;
                        }
                    }

                    /**
                     * @param {string} str
                     * @returns {string}
                     */
                    scope.capitalize = function (str) {
                        //$log.debug('capitalize');
                        if (!str) {
                            return str;
                        }
                        return str[0].toUpperCase() + str.slice(1);
                    };

                    scope.toggleDeleted = function (row) {
                        // revert row
                        if (row.$editable) {
                            var backupRow = scope.backupRow.pop();
                            for (var key in row) {
                                row[key] = backupRow[key];
                            }
                            row.$editable = false;
                            return;
                        }

                        // delete row
                        row.$deleted = !(row.$deleted || false);
                        if (row.$deleted && scope.simpleGrid.options && scope.simpleGrid.options.rowDeleted) {
                            scope.simpleGrid.options.rowDeleted(row);
                        }
                    };

                    scope.toggleAdd = function (row) {
                        if (isRequiredFieldsEmpty(row)) {
                            scope.onError = true;
                            return;
                        }
                        scope.onError = false;
                        scope.simpleGrid.options.rowAdded(row);
                        scope.row = {};
                    };

                    scope.editRequested = function (row) {
                        // if is there any required field empty
                        if (row.$editable && isRequiredFieldsEmpty(row)) return;

                        if (scope.simpleGrid.options.perRowEditModeEnabled) {
                            row.$editable = !(row.$editable || false);
                        }
                        if (!scope.simpleGrid.options.editRequested) return;

                        if (!row.$editable)
                            scope.simpleGrid.options.editRequested(row);
                        else // do a backup of row
                            scope.backupRow.push(angular.copy(row));
                    };

                    function isRequiredFieldsEmpty(row) {
                        if (!Object.keys(row).length) return true;
                        var columns = scope.simpleGrid.options.columns;

                        return columns.some(function (item) {
                            if (validateFunction(item.required)(row)) {
                                if (row[item.field] === undefined)
                                    return true;
                            }
                        });
                    }

                    /**
                     * @param {number} rowIndex
                     * @returns {boolean}
                     */
                    scope.isInvalid = function (rowIndex) {
                        //$log.debug('isInvalid', rowIndex);
                        var formCtrl = scope.$eval(scope.formName(rowIndex));
                        return formCtrl.$error;
                    };


                    /**
                     * @param {jQuery.event} event
                     * @param {number} rowIndex
                     * @param {number} colIndex
                     */
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
                            case 13:
                                event.currentTarget.blur();
                                event.preventDefault();
                                return;
                        }
                        setFocusedCell(event, targetRowIndex, colIndex);
                    };

                    /**
                     * @param row
                     * @param column
                     * @returns {string}
                     */
                    scope.getCellHref = function (row, column) {
                        return column.getUrl(row);
                    };

                    scope.toggleRowSelected = function (row) {
                        if (row && row.$selected) {
                            setRowSelected(row, false);
                            scope.selectRow(null);
                        } else {
                            scope.selectRow(row);
                        }
                    };

                    scope.selectRow = function (row) {
                        //$log.debug('selectRow', row);
                        if (!scope.simpleGrid.options.allowMultiSelect) {
                            if (scope.selectedRow && scope.selectedRow.$selected) {
                                delete scope.selectedRow.$selected;
                            }
                        }
                        if (!row || row.$deleted) {
                            scope.selectedRow = null;
                            return;
                        }
                        setRowSelected(row, true);
                        scope.selectedRow = row;

                        if (scope.simpleGrid.options.rowSelected) {
                            scope.simpleGrid.options.rowSelected(row);
                        }
                    };

                    scope.setFocusedRow = function (row) {
                        //$log.debug('setFocusedRow', row);
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

                    scope.cellBlurred = function (event, row, column) {
                        scope.setFocusedRow(null);
                    };

                    scope.cellFocused = function (event, row, column) {
                        //$log.debug('cellFocused', row, column);
                        if (event.currentTarget.type === 'checkbox') {
                            return;
                        }
                        scope.setFocusedRow(row);
                        if (!scope.simpleGrid.options.allowMultiSelect) {
                            scope.selectRow(row);
                        }
                        if (column && scope.simpleGrid.options.cellFocused) {
                            scope.simpleGrid.options.cellFocused(row, column);
                        }
                    };

                    /**
                     * @param {jQuery.event} event
                     * @param {number} rowIndex
                     * @param {number} columnIndex
                     * @param row
                     * @param column
                     */
                    scope.startEditingCell = function (event, rowIndex, columnIndex, row, column) {
                        row.$editable = true;
                        $timeout(function () {
                            setFocusedCell(null, rowIndex, columnIndex);
                        });
                    };

                    scope.formName = (function () {
                        // memoize
                        var formNames = {};
                        /**
                         * @returns {string}
                         */
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

                    scope.movePage = function (offset) {
                        var pagesCount = scope.page.length;

                        scope.simpleGrid.options.pageNum += offset;
                        scope.simpleGrid.options.pageNum = Math.max(0, scope.simpleGrid.options.pageNum);
                        scope.simpleGrid.options.pageNum = Math.min(pagesCount, scope.simpleGrid.options.pageNum);
                    };

                    scope.updatePage = function () {
                        var i, pageSize, pageStart;
                        scope.page.length = 0;

                        if (!scope.data) {
                            return;
                        }

                        pageSize = scope.simpleGrid.options.pageSize || scope.data.length;
                        pageStart = (scope.simpleGrid.options.pageNum || 0) * pageSize;

                        for (i = pageStart;
                            i < Math.min(pageStart + pageSize, scope.data.length);
                            i += 1) {
                            scope.page.push(scope.data[i]);
                        }
                    };
                    
                    scope.getSelectOptionByValue = function (options, value) {
                        if (!options) return value;

                        var filteredOptions = options.filter(function (option) {
                            return option.value === value;
                        });

                        if (!filteredOptions.length) {
                            // TODO: Write a log indicating that the value was not found.
                            return value;
                        }
                        return filteredOptions[0].title;
                    };

                    scope.getCellText = function (row, column) {
                        //$log.debug('getCellText');//, row, column);
                        var cellValue = row[column.field];

                        // Hard Code
                        if (column.inputType === 'select') {
                            cellValue = scope.getSelectOptionByValue(column.$options(row), cellValue);
                        }

                        return column.$formatter(cellValue, row);
                    };

                    scope.log = function (item) {
                        console.log(item);
                    }

                    function validateFunction(f) {
                        var getType = {};

                        // if 'f' is a function
                        if (f && getType.toString.call(f) === '[object Function]')
                            return f;

                        // return 'f' if it's a value or return first argument if it's not an object
                        // because if it's an object that means it's the row object
                        return function (x) {
                            return f !== undefined ? f : (typeof (x) !== 'object' ? x : undefined);
                        };
                    }

                    function getOptionsForSelectColumn(column) {
                        // TODO: Allow column.options to be a promise
                        var options = column.options;

                        if (!options) {
                            return [];
                        }

                        if (options.length) {
                            // TODO: Not compatible with old browsers
                            return options.map(function (val) {
                                return {
                                    value: val.value,//column.$select(val.value),
                                    title: column.$formatter(val.title)
                                };
                            });
                        }
                        return options;
                    }

                    function recalculateColumns(columns) {
                        angular.forEach(columns, function (column) {
                            column.$title = column.title || scope.capitalize(column.field);
                            column.$formatter = validateFunction(column.formatter);
                            column.$disabled = validateFunction(column.disabled);
                            column.$required = validateFunction(column.required);
                            column.$options = validateFunction(column.options);
                            //column.$select = validateFunction(column.select);
                        });
                    }

                    function initialize() {
                        var columnsWatcherDeregister;
                        scope.gridNum = gridNum;
                        gridNum += 1;

                        scope.row = {};
                        scope.backupRow = [];

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
                            scope.gridIsEditable = function (editable) {
                                if (angular.isUndefined(editable)) {
                                    return true; // editable by default
                                }
                                return editable || false;
                            };
                        });

                        scope.$watch('simpleGrid.options.dynamicColumns', function (newVal) {
                            if (columnsWatcherDeregister) { columnsWatcherDeregister(); }
                            if (newVal) {
                                columnsWatcherDeregister = scope.$watch('simpleGrid.options.columns', recalculateColumns, true);
                            } else {
                                columnsWatcherDeregister = scope.$watchCollection('simpleGrid.options.columns', recalculateColumns);
                            }
                        });
                    }

                    initialize();
                },

                templateUrl: function (tElement, tAttrs) {
                    return document.getElementById('simple-grid.html').getAttribute('src');
                }
            };
        }]);
}());
