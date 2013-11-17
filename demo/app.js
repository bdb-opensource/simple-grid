/*global angular:false */
(function () {
    'use strict';

    angular.module('demo', ['simpleGrid'])
        .controller('MainCtrl', function ($scope, $log) {
            $log.info('test');
            $scope.gridConfig = {
                options: {
                    showDelete: true
                },
                columns: [
                    {
                        field: 'name',
                        inputType: 'text',
                        required: true,
                        enabled: true
                    },
                    {
                        field: 'age',
                        inputType: 'number',
                        required: false,
                        enabled: true
                    }
                ],
                rows: [ { name: 'joe', age: 1 },
                        { name: 'schmo', age: 100 }
                      ]
            };
        });

}());
