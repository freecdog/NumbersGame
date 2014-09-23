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
    jApp.controller('jController', ['$scope', '$http', '$window', function($scope, $http, $window) {
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
        $scope.Localization = Localization;
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

        // Style section
        $scope.validStyles = ['style', 'BlackWhite']; // 0 index is default
        function getStorageStyleValue(){
            var style = 'style';
            //var localStorage = window.localStorage;
            if (localStorage){
                var alterStyle = localStorage.getItem("style");
                if (alterStyle) {
                    style = alterStyle;
                    console.log('we have value in localStorage:', style, ', it will be set');
                }
            } else {
                console.error('no local storage');
            }
            return style;
        }
        function setStorageStyleValue(style){
            console.log('setting storage value to', style);
            //var localStorage = window.localStorage;
            if (localStorage) {
                localStorage.setItem('style', style);
            } else {
                console.error('no local storage');
            }
        }
        $scope.setStorageStyle = function(style){
            if ($scope.validStyles.indexOf(style) == -1) {
                console.warn('invalid style:', style, 'changing style to default value');
                style = $scope.validStyles[0];
            }
            console.log('changing css string to', style);
            $scope.css = '/stylesheets/' + style + '.css';
            setStorageStyleValue(style);
            // safe apply, but everywhere were written tis is bad practice
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        };
        $scope.getStorageStyle = function(){
            var style = getStorageStyleValue();
            $scope.storageStyle = style;
            return style;
        };
        // default value sets by $watch
        $scope.$watch($scope.getStorageStyle, function(newValue, oldValue){
            console.log('style changed to', newValue, 'from', oldValue);
            $scope.setStorageStyle(newValue);
        },false);
    }]);


})(angular, window);
