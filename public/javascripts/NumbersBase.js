/**
 * Created by jaric on 25.07.2014.
 */
(function(exports){

    // private
    function stringToDices(dicesString){
        var dices = [0, 0, 0, 0, 0, 0];
        var fault = false;
        if( typeof dicesString === 'string' ) {
            if (dicesString.length == 6) {
                for (var i = 0 ; i < 6; i++) {
                    if (dicesString[i] >= '1' && dicesString[i] <= '6')
                        dices[i] = dicesString[i];
                    else
                        fault = true;
                }
            } else fault = true;
        }
        if (!fault) return dices;
        else return false;
    }
    function isIntNumber(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }
    function dicesSum(dices) {
        var ans = 0;
        for (var i = 0; i < 6; i++) ans += parseInt(dices[i]);
        return ans;
    }

    // combinations
    function check1er(dices){
        var ans = 0;
        for (var i = 0; i < 6; i++) if (dices[i] == '1') ans += 1;
        return ans;
    }
    function check2er(dices){
        var ans = 0;
        for (var i = 0; i < 6; i++) if (dices[i] == '2') ans += 2;
        return ans;
    }
    function check3er(dices){
        var ans = 0;
        for (var i = 0; i < 6; i++) if (dices[i] == '3') ans += 3;
        return ans;
    }
    function check4er(dices){
        var ans = 0;
        for (var i = 0; i < 6; i++) if (dices[i] == '4') ans += 4;
        return ans;
    }
    function check5er(dices){
        var ans = 0;
        for (var i = 0; i < 6; i++) if (dices[i] == '5') ans += 5;
        return ans;
    }
    function check6er(dices){
        var ans = 0;
        for (var i = 0; i < 6; i++) if (dices[i] == '6') ans += 6;
        return ans;
    }
    function checkTriple(dices){
        var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0;
        for (var i = 0; i < 6; i++) {
            if (dices[i] == '1') c1++;
            if (dices[i] == '2') c2++;
            if (dices[i] == '3') c3++;
            if (dices[i] == '4') c4++;
            if (dices[i] == '5') c5++;
            if (dices[i] == '6') c6++;
        }
        var cnt = 3;
        if (c1 >= cnt || c2 >= cnt || c3 >= cnt || c4 >= cnt || c5 >= cnt || c6 >= cnt)
            return dicesSum(dices);
        else
            return 0;
    }
    function checkQuad(dices){
        var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0;
        for (var i = 0; i < 6; i++) {
            if (dices[i] == '1') c1++;
            if (dices[i] == '2') c2++;
            if (dices[i] == '3') c3++;
            if (dices[i] == '4') c4++;
            if (dices[i] == '5') c5++;
            if (dices[i] == '6') c6++;
        }
        var cnt = 4;
        if (c1 >= cnt || c2 >= cnt || c3 >= cnt || c4 >= cnt || c5 >= cnt || c6 >= cnt)
            return dicesSum(dices);
        else
            return 0;
    }
    function checkFullHouse(dices){
        var ans = 0;
        var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0;
        for (var i = 0; i < 6; i++) {
            if (dices[i] == '1') c1++;
            if (dices[i] == '2') c2++;
            if (dices[i] == '3') c3++;
            if (dices[i] == '4') c4++;
            if (dices[i] == '5') c5++;
            if (dices[i] == '6') c6++;
        }
        if (c1 >= 3) {
            if (c2 >= 2) ans = 25;
            if (c3 >= 2) ans = 25;
            if (c4 >= 2) ans = 25;
            if (c5 >= 2) ans = 25;
            if (c6 >= 2) ans = 25;
        }
        if (c2 >= 3) {
            if (c1 >= 2) ans = 25;
            if (c3 >= 2) ans = 25;
            if (c4 >= 2) ans = 25;
            if (c5 >= 2) ans = 25;
            if (c6 >= 2) ans = 25;
        }
        if (c3 >= 3) {
            if (c2 >= 2) ans = 25;
            if (c1 >= 2) ans = 25;
            if (c4 >= 2) ans = 25;
            if (c5 >= 2) ans = 25;
            if (c6 >= 2) ans = 25;
        }
        if (c4 >= 3) {
            if (c2 >= 2) ans = 25;
            if (c3 >= 2) ans = 25;
            if (c1 >= 2) ans = 25;
            if (c5 >= 2) ans = 25;
            if (c6 >= 2) ans = 25;
        }
        if (c5 >= 3) {
            if (c2 >= 2) ans = 25;
            if (c3 >= 2) ans = 25;
            if (c4 >= 2) ans = 25;
            if (c1 >= 2) ans = 25;
            if (c6 >= 2) ans = 25;
        }
        if (c6 >= 3) {
            if (c2 >= 2) ans = 25;
            if (c3 >= 2) ans = 25;
            if (c4 >= 2) ans = 25;
            if (c5 >= 2) ans = 25;
            if (c1 >= 2) ans = 25;
        }
        return ans;
    }
    function checkSmallRoad(dices){
        var ans = 0;
        var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0;
        for (var i = 0; i < 6; i++) {
            if (dices[i] == '1') c1++;
            if (dices[i] == '2') c2++;
            if (dices[i] == '3') c3++;
            if (dices[i] == '4') c4++;
            if (dices[i] == '5') c5++;
            if (dices[i] == '6') c6++;
        }
        if (c1 >= 1 && c2 >= 1 && c3 >= 1 && c4 >= 1) ans = 30;
        if (c5 >= 1 && c2 >= 1 && c3 >= 1 && c4 >= 1) ans = 30;
        if (c5 >= 1 && c6 >= 1 && c3 >= 1 && c4 >= 1) ans = 30;
        return ans;
    }
    function checkBigRoad(dices){
        var ans = 0;
        var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0;
        for (var i = 0; i < 6; i++) {
            if (dices[i] == '1') c1++;
            if (dices[i] == '2') c2++;
            if (dices[i] == '3') c3++;
            if (dices[i] == '4') c4++;
            if (dices[i] == '5') c5++;
            if (dices[i] == '6') c6++;
        }
        if (c1 >= 1 && c2 >= 1 && c3 >= 1 && c4 >= 1 && c5 >= 1) ans = 40;
        if (c6 >= 1 && c2 >= 1 && c3 >= 1 && c4 >= 1 && c5 >= 1) ans = 40;
        return ans;
    }
    function checkYaz(dices){
        var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, c6 = 0;
        for (var i = 0; i < 6; i++) {
            if (dices[i] == '1') c1++;
            if (dices[i] == '2') c2++;
            if (dices[i] == '3') c3++;
            if (dices[i] == '4') c4++;
            if (dices[i] == '5') c5++;
            if (dices[i] == '6') c6++;
        }
        var cnt = 5;
        if (c1 >= cnt || c2 >= cnt || c3 >= cnt || c4 >= cnt || c5 >= cnt || c6 >= cnt)
            return 50;
        else
            return 0;
    }
    function checkChance(dices){
        return dicesSum(dices);
    }

    // public
    exports.generateDice = function(){
        return Math.floor(Math.random()*6) + 1;
    };
    exports.checkCombinations = function(dicesInput) {
        var dices = [0, 0, 0, 0, 0, 0];
        if( Object.prototype.toString.call( dicesInput ) === '[object Array]' ) {
            if (dicesInput.length == 6) {
                for (var i = 0; i < 6; i++) {
                    if (isIntNumber(dicesInput[i]) && dicesInput[i] >= 1 && dicesInput[i] <= 6) {
                        dices[i] = dicesInput[i];
                    } else {
                        dices = false;
                        break;
                    }
                }
            } else dices = false;
        } else {
            dices = stringToDices(dicesInput);
        }
        if (dices != false) {
            var combos = [];
            combos.push(check1er(dices));
            combos.push(check2er(dices));
            combos.push(check3er(dices));
            combos.push(check4er(dices));
            combos.push(check5er(dices));
            combos.push(check6er(dices));
            combos.push(checkTriple(dices));
            combos.push(checkQuad(dices));
            combos.push(checkFullHouse(dices));
            combos.push(checkSmallRoad(dices));
            combos.push(checkBigRoad(dices));
            combos.push(checkYaz(dices));
            combos.push(checkChance(dices));

            return combos;
        }
        else {
            return false;
        }
    };
    exports.collectStatisticsOfGame = function(game) {
        var stats = {};

        stats.game = {};
        stats.players = [];

        stats.game.dicesCount = 0;
        for (var i = 1; i <= 6; i++) stats.game['d'+ i.toString()] = 0;

        function getDicesOfRound(round){
            var dices = [];
            for (var j = 0; j < round.dices.length; j++) dices.push(round.dices[j]);
            if (round.olddices && round.changedDicesIndexes)
                for (var k = 0; k < round.changedDicesIndexes.length; k++) dices.push(round.olddices[k]);
            return dices;
        }
        function collectPlayerStatistic(playerRounds){
            var playerStats = {};

            playerStats.dicesCount = 0;
            for (var i = 1; i <= 6; i++) playerStats['d'+ i.toString()] = 0;

            for (var j = 0; j < playerRounds.length; j++){
                var round = playerRounds[j];
                var roundDices = getDicesOfRound(round);
                for (var k = 0; k < roundDices.length; k++) {
                    var dice = roundDices[k];
                    playerStats['d'+ dice.toString()]++;
                    playerStats.dicesCount++;

                    stats.game['d'+ dice.toString()]++;
                    stats.game.dicesCount++;
                }
            }
            return playerStats;
        }

        for (var pid = 0; pid < game.players.length; pid++){
            var playerRounds = game.rounds[pid];
            stats.players.push(collectPlayerStatistic(playerRounds));
        }

        return stats;
    };

})(typeof exports === 'undefined'? this['NumbersBase']={} : exports);