/**
 * Created by jaric on 22.08.2014.
 */

// TODO, leftPlayers isn't presented

(function (angular){

    "use strict";

    console.log("angTest", angular);

    var jApp = angular.module('jApp', ['ngAnimate']);
    console.log("jApp", jApp);

    function getScreenSize(){
        var winW = 600, winH = 333;
        if (document.body && document.body.offsetWidth) {
            winW = document.body.offsetWidth;
            winH = document.body.offsetHeight;
        }
        if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth ) {
            winW = document.documentElement.offsetWidth;
            winH = document.documentElement.offsetHeight;
        }
        var lastW = winW, lastH = winH;
        if (window.innerWidth && window.innerHeight) {
            winW = window.innerWidth;
            winH = window.innerHeight;
        }
        // to detect scroll width
        if (Math.abs(lastW - winW) < 30) winW = Math.min(lastW, winW);
        if (Math.abs(lastH - winH) < 30) winH = Math.min(lastH, winH);
        return {width: winW, height: winH};
    }
    function calculateDiceSize(){
        var screenSize = getScreenSize();
        var diceWidth = Math.floor((screenSize.width) / 6) - 1;
        if (diceWidth > 100) diceWidth = 100;
        var diceBorderRadius = Math.floor(diceWidth / 5);
        return {diceWidth: diceWidth, diceBorderRadius: diceBorderRadius};
    }

    jApp.controller('jController', ['$scope', '$http', '$window', function($scope, $http, $window) {

        $scope.combosNames = [];

        //TODO, when searching game after previous finished language doesn't change
        $scope.language = 'en';

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
            // to force change text
            lastAction();
            updateCurrentRound();
        }, false);

        clearPlayground();

        var lastAction = function(){};

        $scope.connect = function(){
            $http.get('/api/connectPlayer').success(function(data){
                console.log("data fetched, from connect", data);
                $scope.sessionID = data.sessionID;

                $scope.findGame();
            });
        };

        var findTick = 0;
        $scope.findGame = function(){
            $http.get('/api/findGame').success(function(data){
                console.log("data fetched, from find:", data);
                $scope.game = data;

                if ($scope.game.playersOnline == null) {
                    if ($scope.game.myPlayerIndex == undefined) $scope.game.myPlayerIndex = $scope.game.playerIndex;

                    $scope.comment = '';
                    clearPlayground();
                    $scope.getDice();
                } else {
                    console.log("game wasn't found yet");

                    var message = '';
                    //message += 'searching for a game, if nothing is happening for too long touch [restart], players searching now: ';
                    if ($scope.game.playersSearching) {
                        //message += ', players searching now: ';
                        message += $scope.localization.Play.Other.playersSearching;
                        message += $scope.game.playersSearching;
                    }

                    for (var i = 0; i < findTick; i++) message += '.';
                    findTick++;
                    if (findTick > 3) findTick = 0;

                    $scope.comment = message;

                    lastAction = $scope.findGame;
                }
            });
        };
        $scope.stopFindGame = function(){
            $http.get('/api/stopFindGame').success(function(data){
                console.log("stop find a game", data);
            });
        };

        $scope.getDice = function(){
            $http.get('/api/dices').success(function(data){
                console.log("data fetched, from dice", data);
                _.extend($scope.game, data);

                $scope.getGameData();
            });
        };

        $scope.getGameData = function(){
            $http.get('/api/rounds/' + $scope.game._id).success(function(data){
                console.log("data fetched, from getdata", data);
                _.extend($scope.game, data);

                updateCurrentRound();
                //getUsedCombinations();

                if ($scope.game.winner != null) {
                    //alert(JSON.stringify($scope.game.winner));
                    console.log($scope.game.winner);
                    console.log($scope.game.results);
                }

                lastAction = $scope.getGameData;
            });
        };

        $scope.restart = function(){
            function doRestart(){
                $http.get('/api/giveup').success(function(){
                    $scope.connect();
                });
            }

            var status = $scope.game.status;
            var needConfirmation = status != undefined && status != 90 && status != -1;
            if (needConfirmation) {
                var confirmed = confirm("Leave this game and start new one?");
                if (confirmed) {
                    doRestart();
                }
            } else {
                doRestart();
            }
        };

        $scope.reroll = function(){
            if ($scope.game.clickable === false) {
                console.log('It is not your playground');
                return;
            }

            if ($scope.game.rerolled) {
                console.log('already rerolled');
                return;
            }

            var str = '';
            for (var i = 0; i < $scope.currentSelected.length; i++)
                str += $scope.currentSelected[i] == true ? i.toString() : '';
            if (str.trim().length == 0) {
                console.log('cannot reroll nothing');
                return;
            }

            $http.get('/api/dices/'+str).success(function(data){
                $scope.game.rerolled = true;
                $scope.currentSelected = [false, false, false, false, false, false];

                console.log("data fetched, from reroll", data);
                _.extend($scope.game, data);

                $scope.getGameData();
            });
        };

        $scope.acceptCombination = function(combo){
            var index = combo.index;

            if ($scope.game.clickable === false) {
                console.log('It is not your playground');
                return;
            }

            var usedCombos = getUsedCombinations();
            for (var i = 0; i < usedCombos.length; i++) {
                if (index == usedCombos[i]) {
                    console.log('already used combo', index, usedCombos);
                    return;
                }
            }

            combo.used = true;
            $http.get('/api/combination/'+index.toString()).success(function(data){
                $scope.game.rerolled = false;
                $scope.currentSelected = [false, false, false, false, false, false];

                console.log("data fetched", data);
                _.extend($scope.game, data);

                $scope.getDice();
            });
        };

        $scope.toggleDice = function(index){
            if ($scope.game.clickable === false) {
                console.log('It is not your playground');
                return;
            }

            $scope.currentSelected[index] = !$scope.currentSelected[index];
        };

        $scope.showPlayer = function(index){
            if ($scope.game.myPlayerIndex == undefined) $scope.game.myPlayerIndex = $scope.game.playerIndex;

            // if (true) welcome back home
            $scope.game.clickable = $scope.game.myPlayerIndex == index;

            $scope.game.playerIndex = index;

            // should update faster other state
            lastAction();
        };

        $scope.$watch('game.status', function(newValue){
            console.log('status changed to', newValue);
            /*if (newValue === undefined) {
                $scope.comment = 'searching for a game, if nothing is happening for too long touch [restart]';
            } else if (newValue === 20) {
                $scope.comment = 'game in progress';
            } else if (newValue === 90) {
                $scope.comment = 'game is finished, touch [restart] to play again';
            } else {
                $scope.comment = 'unknown state';
            }*/
        }, false);

        $scope.perfectCombosSort = function(combo){
            var ans = combo.points;

            //if (combo.used == true) ans -= 100;
            // it depends on order of elements (and blinking while reordering)
            if (combo.used == true) ans = (ans+100) * (-1);
            return ans;
        };

        function updateCurrentRound(){
            if (!$scope.game) {
                console.log("game isn't initialized yet");
                return;
            }
            var pId = $scope.game.playerIndex;
            var rounds = $scope.game.rounds[pId];

            var lastRound = rounds[ rounds.length-1 ];
            var usedCombos = getUsedCombinations();
            for (var i = 0; i < usedCombos.length; i++){
                var rId = usedCombos[i];
                lastRound.combinations[rId] = getRound(rId).points;
            }

            var preparedCombos = [];
            for (var j = 0; j < lastRound.combinations.length; j++){
                preparedCombos.push({
                    index: j,
                    name: $scope.combosNames[j],
                    points: lastRound.combinations[j],
                    used: false
                });
            }
            for (var k = 0; k < usedCombos.length; k++) {
                preparedCombos[usedCombos[k]].used = true;
            }
            //console.warn(preparedCombos);

            lastRound.preparedCombos = preparedCombos;

            $scope.currentRound = lastRound;

            if ($scope.preparedCombos == null){
                $scope.preparedCombos = preparedCombos;
            } else {
                for (var pi = 0; pi < preparedCombos.length; pi++){
                    if (preparedCombos[pi].index == $scope.preparedCombos[pi].index) {
                        // this method (obj = obj) is blinking
                        //if (preparedCombos[pi].used != $scope.preparedCombos[pi].used
                        //    || preparedCombos[pi].points != $scope.preparedCombos[pi].points)
                        //    $scope.preparedCombos[pi] = preparedCombos[pi];
                        if (preparedCombos[pi].used != $scope.preparedCombos[pi].used){
                            $scope.preparedCombos[pi].used = preparedCombos[pi].used;
                        }
                        if (preparedCombos[pi].points != $scope.preparedCombos[pi].points){
                            $scope.preparedCombos[pi].points = preparedCombos[pi].points;
                        }
                        if (preparedCombos[pi].name != $scope.preparedCombos[pi].name){
                            $scope.preparedCombos[pi].name = preparedCombos[pi].name;
                        }
                    }
                }
            }

            // sums
            var sums = {total: 0, sumNumbers: 0, sumBonus: 0, sumNames: 0};
            for (var si = 0; si < usedCombos.length; si++) {
                var roundPoints = lastRound.combinations[usedCombos[si]];
                // if index of used combination is below 6 (Ones, Twos, ..., Sixes) sum to sumNumbers
                if (usedCombos[si] < 6)
                    sums.sumNumbers += roundPoints;
                else
                    sums.sumNames += roundPoints;
            }
            if (sums.sumNumbers >= 63) sums.sumBonus += 35;
            sums.total = sums.sumNumbers + sums.sumBonus + sums.sumNames;
            //console.log('sums', sums.total, sums.sumNumbers, sums.sumBonus, sums.sumNames);
            $scope.sums = sums;
        }

        function getUsedCombinations(){
            var pId = $scope.game.playerIndex;
            var rounds = $scope.game.rounds[pId];

            $scope.usedCombinations = [];

            var usedCombos = [];
            for (var i = 0; i < rounds.length; i++){
                if (rounds[i].combinationIndex != null) {
                    usedCombos.push(rounds[i].combinationIndex);
                    $scope.usedCombinations[rounds[i].combinationIndex] = true;
                }
            }
            return usedCombos;
        }

        function getRound(index){
            var pId = $scope.game.playerIndex;
            var rounds = $scope.game.rounds[pId];

            for (var i = 0; i < rounds.length; i++){
                if (rounds[i].combinationIndex == index) return rounds[i];
            }
        }

        function clearPlayground(){
            // dice
            $scope.currentSelected = [false, false, false, false, false, false];
            // combos
            $scope.usedCombinations = [];
        }

        function changeDiceSize(){
            var ds = calculateDiceSize();
            $scope.diceSize = ds.diceWidth;
            $scope.diceBorderRadius = ds.diceBorderRadius.toString() + 'px';
            //console.warn($scope.diceSize);
        }
        changeDiceSize();

        var w = angular.element($window);
        w.bind('resize', function () {
            changeDiceSize();
        });


        // Start!!!
        $scope.connect();

        // auto update
        function autoUpdater(){
            lastAction();
            setTimeout(autoUpdater, 1000);
        }
        setTimeout(autoUpdater, 1000);
    }]);

    jApp.filter('bracketMe', function(){
        return function(input){
            return ' [' + input + '] ';
        };
    });
})(angular);