/*global $: false, angular: false */
(function () {
    'use strict';

    angular.module('simpleGrid', [])
        .directive('simpleGrid', function () {
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
                    };
                },
                templateUrl: function (tElement, tAttrs) {
                    return document.getElementById('simple-grid.html').getAttribute('src');
                }
            };
        });
}());