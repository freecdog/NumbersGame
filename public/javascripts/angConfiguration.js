/**
 * Created by jaric on 21.09.2014.
 */

(function (angular){

    "use strict";

    console.log("angTest", angular);

    var jApp = angular.module('jApp', []);
    console.log("jApp", jApp);

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function setMultiplayerPlayersCount(count){
        localStorage.setItem("multiplayerPlayersCount", count.toString());
    }
    function getMultiplayerPlayersCount(){
        var defaultCount = '2';
        var localStorage = window.localStorage;
        if (!localStorage) return defaultCount;
        var searchPlayersCount = localStorage.getItem("multiplayerPlayersCount");
        if (isNumber(searchPlayersCount)) {
            //searchPlayersCount = Math.floor(parseFloat(searchPlayersCount));
            return searchPlayersCount;
        } else return defaultCount;
    }

    // TODO, need correct ng validate
    jApp.controller('jController', ['$scope', '$http', function($scope, $http) {
        $scope.multiplayerPlayersCount = getMultiplayerPlayersCount();
        $scope.$watch(getMultiplayerPlayersCount,function(newValue){
            $scope.multiplayerPlayersCount = newValue;
            console.log('plCount', newValue);
        },false);
        $scope.setMultiplayerPlayersCount = function(count){
            setMultiplayerPlayersCount(count);
        };
        $scope.$watch('name',function(newValue, oldValue){
            console.log('nw', newValue, oldValue);
            if (oldValue === undefined) $scope.nameChanged = false;
            else $scope.nameChanged = true;
        },false);

        $scope.getName = function(){
            $http.get('/api/getName').success(function(data){
                $scope.name = data.login;

            });
        };
        $scope.setName = function(name){
            if (name){
                console.log('sending name', name);
                $http.get('/api/changeName/' + name).success(function(data){
                    $scope.name = data.login;
                    $scope.nameChanged = false;
                });
            }
        };

        // get name on load
        $scope.getName();
    }]);

})(angular);
