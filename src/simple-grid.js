/*global document: false, angular: false */
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
                    scope.capitalize = function (str) {
                        if (!str) { return str; }
                        return str[0].toUpperCase() + str.slice(1);
                    };
                    
                    scope.markDeleted = function (row) {
                        row.$deleted = true;
                        if (scope.simpleGrid.options && scope.simpleGrid.options.rowDeleted) {
                            scope.simpleGrid.options.rowDeleted(row);
                        }
                    };
					
                    scope.isInvalid = function (rowIndex) {
                        var formCtrl = scope.$eval('simpleGrid' + scope.gridNum + 'Row' + rowIndex);
                        return formCtrl.$error;
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
