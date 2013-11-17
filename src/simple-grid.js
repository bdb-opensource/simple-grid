/*global angular: false */
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
                template: ' \
<table class="table table-striped simple-grid"> \
    <thead>                 \
        <tr>                \
            <th ng-repeat="column in simpleGrid.columns">{{column.title || capitalize(column.field)}}</th>  \
            <th ng-if="simpleGrid.options.showDelete"></th> \
        </tr>               \
    </thead>                \
    <tbody>                 \
        <tr ng-repeat="row in simpleGrid.rows" ng-class="{deleted: row.$deleted}"> \
            <td ng-repeat="column in simpleGrid.columns">   \
                <input ng-if="column.inputType !== \'select\'"  class="form-control"   \
                       type="column.inputType"                  \
                       ng-model="row[column.field]"             \
                       ng-required="column.required"            \
                       placeholder="{{column.placeholder}}"    \
                       ng-disabled="column.disabled || row.$deleted || simpleGrid.disabled"/>          \
                <select ng-if="column.inputType === \'select\'" class="form-control"  \
                        ng-model="row[column.field]"            \
                        ng-required="column.required"           \
                        ng-disabled="column.disabled || row.$deleted || simpleGrid.disabled"           \
                        ng-options="column.options"/>           \
            </td>   \
            <td ng-if="simpleGrid.options.showDelete">          \
                <button type="button" class="btn btn-small"     \
                        ng-class="{\'btn-danger\': !row.$deleted }"  \
                       ng-click="markDeleted(row)"             \
                        ng-disabled="column.disabled || row.$deleted || simpleGrid.disabled"   \
                        >   \
                    <i class="glyphicon glyphicon-trash"></i></button> \
            </td>   \
        </tr>       \
    </tbody>        \
</table>'
            };
        });
}());