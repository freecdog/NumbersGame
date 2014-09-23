/**
 * Created by jaric on 24.09.2014.
 */

(function (angular, window){

    "use strict";

    console.log("angTest", angular);

    var jApp = angular.module('jApp', []);
    console.log("jApp", jApp);
    jApp.controller('jController', ['$scope', function($scope) {
        // Language section
        jAngLanguages(window, $scope, Localization);

        // Style section
        jAngStlyes(window, $scope);
    }]);

})(angular, window);
