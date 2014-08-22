/**
 * Created by yarvyk on 22.08.2014.
 */

(function (angular){

    "use strict";

    console.log("angTest", angular);

    var jApp = angular.module('jApp', []);
    console.log("jApp", jApp);

    var jMemory = {};

    // Not necessary to have this bridge, SHOULD BE CHANGED TO $scope
    window.jMemory = jMemory;

    jApp.controller('jController', ['$scope', '$http', function($scope, $http) {

        // till http request doesn't processed there will be temp data
        $scope.names = ["1er", "2er", "3er", "4er", "5er", "6er",
            "Dreir Pasch", "Vierer Pasch", "Full House",
            "Kleine Straße", "Große Straße", "Yazzee", "Chance"];
        clearPlayground();

        $scope.toggleDie = function(index){
            $scope.currentSelected[index] = !$scope.currentSelected[index];
        };

        $scope.connect = function(){
            $http.get('/api/connectPlayer').success(function(data){
                console.log("data fetched, from connect", data);
                jMemory.sessionID = data.sessionID;

                $scope.findGame();
            });
        };

        $scope.findGame = function(){
            $http.get('/api/findGame').success(function(data){
                console.log("data fetched, from find:", data);
                jMemory.game = data;

                if (jMemory.game.playersOnline == null) {
                    clearPlayground();
                    $scope.getDice();
                } else
                    console.warn("findGame failed");
            });
        };

        $scope.getDice = function(){
            $http.get('/api/dices').success(function(data){
                console.log("data fetched, from dice", data);
                _.extend(jMemory.game, data);

                $scope.getGameData();
            });
        };

        $scope.getGameData = function(){
            $http.get('/api/rounds/' + jMemory.game._id).success(function(data){
                console.log("data fetched, from getdata", data);
                _.extend(jMemory.game, data);

                updateCurrentRound();
                getUsedCombinations();

                if (jMemory.game.winner != null) {
                    alert(JSON.stringify(jMemory.game.winner));
                }
            });
        };

        $scope.restart = function(){
            $http.get('/api/giveup').success(function(data){
                $scope.findGame();
            });
        };

        $scope.reroll = function(){
            if (jMemory.game.rerolled) {
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
                jMemory.game.rerolled = true;
                $scope.currentSelected = [false, false, false, false, false, false];

                console.log("data fetched, from reroll", data);
                _.extend(jMemory.game, data);

                $scope.getGameData();
            });
        };

        $scope.accpetCombination = function(index){
            var usedCombos = getUsedCombinations();
            for (var i = 0; i < usedCombos.length; i++) {
                if (index == usedCombos[i]) {
                    console.log('already used combo', index, usedCombos);
                    return;
                }
            }

            $http.get('/api/combination/'+index.toString()).success(function(data){
                jMemory.game.rerolled = false;
                $scope.currentSelected = [false, false, false, false, false, false];

                console.log("data fetched", data);
                _.extend(jMemory.game, data);

                $scope.getDice();
            });
        };

        function updateCurrentRound(){
            console.log("jM", jMemory);
            var pId = jMemory.game.playerIndex;
            var rounds = jMemory.game.rounds[pId];

            console.log(jMemory.game.rounds, pId);
            var lastRound = rounds[ rounds.length-1 ];
            var usedCombos = getUsedCombinations();
            for (var i = 0; i < usedCombos.length; i++){
                var rId = usedCombos[i];
                lastRound.combinations[rId] = getRound(rId).points;
            }

            $scope.currentRound = lastRound;
        }

        function getUsedCombinations(){
            var pId = jMemory.game.playerIndex;
            var rounds = jMemory.game.rounds[pId];

            var usedCombos = [];
            for (var i = 0; i < rounds.length; i++){
                if (rounds[i].combinationIndex !== null) {
                    usedCombos.push(rounds[i].combinationIndex);
                    $scope.usedCombinations[rounds[i].combinationIndex] = true;
                }
            }
            return usedCombos;
        }

        function getRound(index){
            var pId = jMemory.game.playerIndex;
            var rounds = jMemory.game.rounds[pId];

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
    }]);

})(angular);