/**
 * Created by jaric on 22.08.2014.
 */

// TODO, leftPlayers isn't presented

(function (angular){

    "use strict";

    console.log("angTest", angular);

    var jApp = angular.module('jApp', ['ngAnimate']);
    console.log("jApp", jApp);

    jApp.controller('jController', ['$scope', '$http', function($scope, $http) {

        var combosNames = ["1er", "2er", "3er", "4er", "5er", "6er",
            "Dreir Pasch", "Vierer Pasch", "Full House",
            "Kleine Straße", "Große Straße", "Yazzee", "Chance"];
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

                    clearPlayground();
                    $scope.getDice();
                } else {
                    console.log("game wasn't found yet");

                    var message = 'searching for a game';
                    message += ', if nothing is happening for too long touch [restart], ';
                    message += 'players searching now: ';
                    if ($scope.game.playersSearching) message += $scope.game.playersSearching;

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
            if (newValue === undefined) {
                $scope.comment = 'searching for a game, if nothing is happening for too long touch [restart]';
            } else if (newValue === 20) {
                $scope.comment = 'game in progress';
            } else if (newValue === 90) {
                $scope.comment = 'game is finished, touch [restart] to play again';
            } else {
                $scope.comment = 'unknown state';
            }
        }, false);

        $scope.perfectCombosSort = function(combo){
            var ans = combo.points;

            //if (combo.used == true) ans -= 100;
            // it depends on order of elements (and blinking while reordering)
            if (combo.used == true) ans = (ans+100) * (-1);
            return ans;
        };

        function updateCurrentRound(){
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
                    name: combosNames[j],
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
                    }
                }
            }
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