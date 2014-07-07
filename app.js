var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 33322);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret here' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function generateDice(){
    return Math.floor(Math.random()*6) + 1;
}
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

function checkCombinations(dicesInput) {
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
}

console.log(checkCombinations("134256"));


var value = 0;

var minPlayers = 2;

var connectedCookies = {};

var purchases = {};

var gamesIndex = 0;
var games = {};
var gamesInProgress = {};

function removeExpiredConnections(){
    for (var key in connectedCookies) {
        if (connectedCookies.hasOwnProperty(key)) {
            //console.log ( ((new Date()) - connectedCookies[key]).toString() );
            if (Math.abs(new Date() - connectedCookies[key].time) > 600000) {   // 1 hour

                for (var gInd in games) {
                    var game = games[gInd];
                    for (var playerIndex in game.players) {
                        var player = game.players[playerIndex];
                        if (player == key) {
                            //console.log("games[" + gInd + "] deleted");
                            //delete games[gInd];
                            // if game wasn't ended it is marked as abandoned, else if purchases info still alive it will be deleted
                            if (games[gInd].status != 9){
                                games[gInd].status = -1;
                            } else {
                                if (purchases[gInd] != null) delete purchases[gInd];
                            }
                            break;
                        }
                    }
                }
                console.log("Cookie[" + key + "] deleted");
                delete connectedCookies[key];
            }
        }
    }
}
function prepareGame() {
    var wannaPlayers = [];

    for (var key in connectedCookies) {
        if (connectedCookies.hasOwnProperty(key)) {
            // if status "searching"
            var player = connectedCookies[key];
            player.id = key;
            if (player.status == 2) {
                wannaPlayers.push(key);
            }
        }
    }

    var len = wannaPlayers.length;
    if (len >= minPlayers) {
        var gameId = "g" + gamesIndex.toString();
        games[gameId] = {};
        games[gameId].id = gameId;
        gamesIndex++;
        games[gameId].players = [];
        games[gameId].status = 1;
        for (var i = 0; i < minPlayers; i++) {
            if (i==0) {
                //games[gameId].settings = connectedCookies[wannaPlayers[i]].settings;
                //games[gameId].boxes = connectedCookies[wannaPlayers[i]].boxes;
            }

            games[gameId].players.push(wannaPlayers[i]);
            if (games[gameId].names == null) games[gameId].names = [];

            var playerName = connectedCookies[wannaPlayers[i]].settings.name;
            if (playerName == undefined || playerName == null || playerName == "")
                games[gameId].names.push("player" + (10000 * Math.random()).toFixed(0) );
            else
                games[gameId].names.push(connectedCookies[wannaPlayers[i]].settings.name);
            //console.log("names:", games[gameId].names);

            connectedCookies[wannaPlayers[i]].status = 3;
        }
    }
}
function findGameById(sessionId) {
    for (var gInd in games) {
        var game = games[gInd];
        //if (game.status == 1) {
        for (var j = 0; j < game.players.length; j++) {
            if (sessionId == game.players[j]) {
                return game;
            }
        }
        //}
    }
    return null;
}

app.get('/', routes.index);
app.get('/play', function(req,res){
    res.render("play");
});

app.get('/onlineStatistics', function(req, res){
    removeExpiredConnections();

    res.render("onlineStatistics", {
        serverTime: new Date(),
        connected: connectedCookies,
        games: games
    });
});

app.get('/api/dices', function(req, res){
    var combo = [generateDice(), generateDice(), generateDice(), generateDice(), generateDice(), generateDice()];
    //var combinationString = ""; for (var i =0; i<6; i++) combinationString += combo[i].toString();
    console.log(req.connection.remoteAddress, combo);
    res.send(combo);
});
app.get('/api/dices/:dicesindexes', function(req, res){
    //var combo = [generateDice(), generateDice(), generateDice(), generateDice(), generateDice(), generateDice()];
    //var combinationString = ""; for (var i =0; i<6; i++) combinationString += combo[i].toString();

    var combo = [];
    //console.log("user params", req.params);
    for (var i = 0; i < req.params.dicesindexes.length; i++){
        combo.push(generateDice());
    }

    //console.error("need some code here");
    console.log(req.connection.remoteAddress, combo);
    res.send(combo);
});

function collectOnlineStatistics(){
    var data = {};
    data.playersOnline = Object.keys(connectedCookies).length;
    data.playersSearching = 0;
    data.activeGames = 0;
    for(var player in connectedCookies) {
        if (connectedCookies.hasOwnProperty(player)){
            if (connectedCookies[player].status == 1 || connectedCookies[player].status == 2) {
                data.playersSearching++;
            }
        }
    }
    for (var game in games) {
        if (games.hasOwnProperty(game)){
            if (games[game].status == 1) data.activeGames++;
        }
    }
    return data;
}
app.get("/api/connectPlayer", function(req, res){

    if (connectedCookies.hasOwnProperty(req.sessionID)){
        connectedCookies[req.sessionID].time = new Date();
    } else {
        connectedCookies[req.sessionID] = {};
        connectedCookies[req.sessionID].time = new Date();
        connectedCookies[req.sessionID].status = 1; // connected
    }
    console.log(req._remoteAddress + ", players connected, onliners: " + Object.keys(connectedCookies).length.toString());
    var data = collectOnlineStatistics();

    res.send(data);
    removeExpiredConnections();
});
app.get("/api/disconnectPlayer", function(req, res){
    if (connectedCookies[req.sessionID]) {
        connectedCookies[req.sessionID].time = 0;
    }
    removeExpiredConnections();

    console.log(req._remoteAddress + ", disconnected, onliners: " + Object.keys(connectedCookies).length.toString());
    res.send(Object.keys(connectedCookies).length.toString());
});


app.get("/api/findGame", function(req, res){

    connectedCookies[req.sessionID].time = new Date();

    console.log(req._remoteAddress + ", searching for game, onliners: " + Object.keys(connectedCookies).length.toString());

    prepareGame();
    var game = findGameById(req.sessionID);
    res.send(game);

    removeExpiredConnections();
});
app.post("/api/findGame", function(req, res){
    console.log(req._remoteAddress + ", game received, onliners: " + Object.keys(connectedCookies).length.toString());

    connectedCookies[req.sessionID].status = 2; // searching game
    connectedCookies[req.sessionID].time = new Date();

    connectedCookies[req.sessionID].settings = JSON.parse(req.body.settings);
    connectedCookies[req.sessionID].boxes = JSON.parse(req.body.boxes);

    prepareGame();

    var game = findGameById(req.sessionID);
    res.send(game);

    removeExpiredConnections();
});

app.get("/api/dropAll", function(req, res){
    connectedCookies = {};
    games = {};
    res.redirect("/");
});

app.get("/api/gameProcess/:gid", function(req, res){
    //console.log(req._remoteAddress + " GameProcess check" );

    //console.log("purchases: " + JSON.stringify(purchases));

    var data = {};
    var game;
    var gid = req.params.gid;
    if (gid != null && games.hasOwnProperty(gid))
        game = games[gid];
    else
        game = findGameById(req.sessionID);
    //console.log("game:", game.id);
    if (game) {
        data.status = game.status;

        //console.log("purchases.len: ", Object.keys(purchases).length);
        var purchasesToSend = [];
        var indexesToDelete = [];
        var len = 0;
        if (purchases != null && purchases[gid] != null) {
            if (purchases[gid].purchases)
                len = purchases[gid].purchases.length;
            //console.log("trying to send purchases, len:", len);
            for (var i = 0; i < len; i++) {
                if (purchases[gid].purchases[i]){
                    if (purchases[gid].purchases[i].sessionId != req.sessionID) {
                        var ans = {};
                        ans["resourceIndex"] = purchases[gid].purchases[i].purchaseIndex;
                        // #TODO should do something more specific, I mean may be username, but it's ok for 1v1 games
                        ans["owner"] = "1";
                        ans["ownerMoneyChangeValue"] = purchases[gid].purchases[i].ownerMoneyChangeValue;
                        ans["serverTime"] = purchases[gid].purchases[i].serverTime;
                        purchasesToSend.push(ans);
                        //delete purchases[key];
                        indexesToDelete.push(i);
                    }
                }
            }
            for (var i = 0; i < indexesToDelete.length; i++) {
                delete purchases[gid].purchases[indexesToDelete[i]];
            }
        }

        //for (var key in purchases) {
        //    if (purchases.hasOwnProperty(key)) {
        //        if (purchases[key].sessionId != req.sessionID){
        //            var ans = {};
        //            ans["resourceIndex"] = key;
        //            ans["owner"] = "1";
        //            ans["ownerMoneyChangeValue"] = purchases[key].ownerMoneyChangeValue;
        //            purchasesToSend.push(ans);
        //            delete purchases[key];
        //        }
        //    }
        //}
        if (purchasesToSend != null && purchasesToSend.length > 0) {
            console.log("purchasesToSend: " + JSON.stringify(purchasesToSend));
        }
        data.purchases = purchasesToSend;
        res.send(data);

        connectedCookies[req.sessionID].time = new Date();
        removeExpiredConnections();
    } else {
        res.send(data);
    }

});
app.post("/api/gameProcess", function(req, res){

    if (req.body.gameId != null){
        purchases[req.body.gameId] = {};
        purchases[req.body.gameId].gameId = req.body.gameId;

        if (purchases[req.body.gameId].purchases == null)
            purchases[req.body.gameId].purchases = [];

        var item = {};
        item.sessionId = req.sessionID;
        item.purchaseIndex = req.body.purchase;
        item.ownerMoneyChangeValue = req.body.ownerMoneyChangeValue;
        item.serverTime = new Date().getTime();

        purchases[req.body.gameId].purchases.push(item);
        //purchases[req.body.gameId].sessionId = req.sessionID;
        //purchases[req.body.gameId].purchaseIndex = req.body.purchase;
        //purchases[req.body.gameId].ownerMoneyChangeValue = req.body.ownerMoneyChangeValue;
        //purchases[req.body.gameId].serverTime = new Date().getTime();
    }

    //console.log(req._remoteAddress + " purchases " + req.body.purchase );
    res.send("1");

    connectedCookies[req.sessionID].time = new Date();
    removeExpiredConnections();
});


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
