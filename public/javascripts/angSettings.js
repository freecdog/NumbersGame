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
        var language = Localization.defaultLanguage();
        if (localStorage!=null) {
            var storageLanguage = localStorage.getItem('language');
            if (storageLanguage != null){
                if (Localization[storageLanguage] != null){
                    if (Localization.listOfLanguages.indexOf(language) != -1) language = storageLanguage;
                }
            }
        }
        $scope.language = language;
        console.log('language is', Localization[$scope.language]);

        $scope.$watch('language', function(newValue){
            $scope.localization = Localization[$scope.language];

            console.log('language changed to', newValue);
            var lang = Localization[$scope.language];
            var langCombos = lang.Play.Combinations;
            $scope.combosNames = [];
            for (var langCombo in langCombos){
                if (langCombos.hasOwnProperty(langCombo)){
                    $scope.combosNames.push(langCombos[langCombo]);
                }
            }
        }, false);
    }]);

})(angular);
