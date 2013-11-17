/*global $: false, angular: false */
(function () {
    'use strict';

    angular.module('simpleGrid', [])
        .directive('simpleGrid', function () {
            var gridNum = 0;
            return {
                scope: {
                    simpleGrid: '='
                },
                link: function (scope, elem, attrs) {
                    scope.gridNum = gridNum;
                    gridNum += 1;
                    scope.capitalize = function (str) {
                        if (!str) { return str; }
                        return str[0].toUpperCase() + str.slice(1);
                    };
                    scope.markDeleted = function (row) {
                        row.$deleted = true;
                        if (scope.simpleGrid.callbacks && scope.simpleGrid.callbacks.deleted) {
                            scope.simpleGrid.callbacks.deleted(row);
                        }
                    };
                    scope.isInvalid = function (rowIndex) {
                        var formCtrl = scope.$eval('simpleGrid' + scope.gridNum + 'Row' + rowIndex);
                        return formCtrl.$error;
                    };
                },
                templateUrl: function (tElement, tAttrs) {
                    return document.getElementById('simple-grid.html').getAttribute('src');
                }
            };
        });
}());