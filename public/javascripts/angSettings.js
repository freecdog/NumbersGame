/**
 * Created by jaric on 21.09.2014.
 */

(function (angular, window){

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
        // defaultCount = 2;
        var searchPlayersCount = '2';
        if (localStorage){
            var playersCount = localStorage.getItem("multiplayerPlayersCount");
            if (isNumber(playersCount)) {
                //searchPlayersCount = Math.floor(parseFloat(searchPlayersCount));
                searchPlayersCount = playersCount;
            }
        }
        return searchPlayersCount;
    }

    // TODO, need correct ng validate
    jApp.controller('jController', ['$scope', '$http', function($scope, $http) {
        $scope.multiplayerPlayersCount = getMultiplayerPlayersCount();
        $scope.$watch(getMultiplayerPlayersCount,function(newValue){
            $scope.multiplayerPlayersCount = newValue;
            console.log('playersCount', newValue);
        },false);
        $scope.setMultiplayerPlayersCount = function(count){
            setMultiplayerPlayersCount(count);
        };

        $scope.$watch('name',function(newValue, oldValue){
            console.log('name changed to', newValue, 'from', oldValue);
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

        // Language section
        jAngLanguages(window, $scope, Localization);

        // Style section
        jAngStlyes(window, $scope);
    }]);


})(angular, window);
