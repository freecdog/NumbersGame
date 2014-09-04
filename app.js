var express = require('express');
var http = require('http');
var path = require('path');

var _ = require('underscore')._;

var app = express();

// default config
var config = {
    "minPlayers" : 1,
    "secret": "someSecret"
};
function configure(){
    var fs = require('fs');

    var configPath = __dirname + '/config.txt';

    try {
        var filedata = fs.readFileSync(configPath, {encoding: "utf8"});
        // some hack with first symbol =/
        filedata = filedata.replace(/^\uFEFF/, '');
        // parsing file to JSON object
        var jsondata = JSON.parse(filedata);

        if (jsondata){
            var objectFieldsCounter = 0;
            for (var property in jsondata) {
                if (jsondata[property] !== undefined) {
                    objectFieldsCounter++;

                    config[property] = jsondata[property];
                }
            }
            console.log("Configured fields:", objectFieldsCounter);
            console.log("Current configuration:", config);
        } else {
            console.log('No json data in file');
        }
    } catch (e) {
        console.log("error:", e);
    }
}
// now default config should be loaded from config.txt file
configure();

var exec = require('child_process').exec;
function restartServer(){
    exec("sudo service node29 restart", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

// all environments
app.set('port', process.env.PORT || 33322);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var staticFont = require('./staticFont');
app.use(staticFont());

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session({
    secret: config.secret,
    cookie: {
        expires: null,
        maxAge: null
    }
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var NumbersBase = require('./public/javascripts/NumbersBase.js');

var generateDice = NumbersBase.generateDice;
var checkCombinations = NumbersBase.checkCombinations;

//console.log("small test", generateDice(), checkCombinations("134256"));

var value = 0;

var connectedCookies = {};

var purchases = {};

var gamesIndex = 0;
var games = {};
var gamesInProgress = {};

function removeExpiredConnections(){
    var curTime = new Date();

    // http://jsperf.com/stackoverflow-for-vs-hasownproperty/7
    // V8 shows that hasOwnProperty is really slower than object[key] find

    for (var key in connectedCookies) {
        //if (connectedCookies.hasOwnProperty(key)) {
        if (connectedCookies[key] !== undefined) {
            //console.log ( (curTime - connectedCookies[key]).toString() );
            if (Math.abs(curTime - connectedCookies[key].time) > 600000) {   // 1 hour

                for (var gInd in games) {
                    //if (games.hasOwnProperty(gInd)){
                    if (games[gInd] !== undefined){
                        var game = games[gInd];
                        for (var playerIndex in game.players) {
                            //if (game.players.hasOwnProperty(playerIndex)){
                            if (game.players[playerIndex] !== undefined){
                                var player = game.players[playerIndex];
                                if (player == key) {
                                    //console.log("games[" + gInd + "] deleted");
                                    //delete games[gInd];
                                    // if game wasn't ended it is marked as abandoned, else if purchases info still alive it will be deleted
                                    if (games[gInd].status != 90){
                                        games[gInd].status = -1;
                                    } else {
                                        if (purchases[gInd] != null) delete purchases[gInd];
                                    }
                                    break;
                                }
                            }
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
        if (connectedCookies[key] !== undefined) {
            // if status "searching"
            var player = connectedCookies[key];
            player.id = key;
            if (player.status == 2) {
                wannaPlayers.push(key);
            }
        }
    }

    var len = wannaPlayers.length;
    if (len >= config.minPlayers) {
        var gameId = "g" + gamesIndex.toString();
        games[gameId] = {};
        games[gameId]._id = gameId;
        gamesIndex++;
        games[gameId].players = [];
        games[gameId].status = 20;

        for (var i = 0; i < len; i++) {
            if (i==0) {
                //games[gameId].settings = connectedCookies[wannaPlayers[i]].settings;
                //games[gameId].boxes = connectedCookies[wannaPlayers[i]].boxes;
            }

            var userSessionId = wannaPlayers[i];
            games[gameId].players.push(userSessionId);
            if (games[gameId].names == null) games[gameId].names = [];

            // No settings, no name
            //var playerName = connectedCookies[wannaPlayers[i]].settings.name;
            //if (playerName == undefined || playerName == null || playerName == "")
              //  games[gameId].names.push("player" + (10000 * Math.random()).toFixed(0) );
            //else
                //games[gameId].names.push(connectedCookies[wannaPlayers[i]].settings.name);
            var connectedCookie = connectedCookies[userSessionId];
            var playerName = "";
            if (connectedCookie.name){
                playerName = connectedCookie.name;
            } else {
                playerName = "player" + (10000 * Math.random()).toFixed(0);
            }
            games[gameId].names.push(playerName);

            if (games[gameId].rounds == null) games[gameId].rounds = [];
            games[gameId].rounds.push([]);

            connectedCookie.status = 3;
        }
        console.log("names:", games[gameId].names);//, JSON.stringify(games[gameId]));
    }
}
// TODO, now it returns last game of player while iterating through ALL amount of games
// should do something with it
function findGameById(sessionId) {
    var ans = null;

    function isThisGameMine(game){
        var isIt = false;

        var leftPlayers = game.leftPlayers;
        leftPlayers = leftPlayers || {};
        if (leftPlayers[sessionId] === undefined) {
            for (var j = 0; j < game.players.length; j++) {
                if (sessionId == game.players[j]) {
                    isIt = true;
                }
            }
        }
        return isIt;
    }

    for (var gInd in games) {
    //for (var i = gamesIndex-1; i >=0; i--){
        //var gInd = "g" + gamesIndex.toString();
        //if (games.hasOwnProperty(gInd) == false) {
        //    console.log("skipping game index:", i);
        //    continue;
        //}

        var game = games[gInd];
        // if in game
        //if (connectedCookies[sessionId].status == 80){
        //    if (isThisGameMine(game)) {
        //        //return game;
        //        ans = game;
        //    }
        //} else
        {
            //if (game.status != 90 && game.status != -1) {
            if (game.status != -1) {
                if (isThisGameMine(game)) {
                    //return game;
                    ans = game;
                }
            }
        }
    }
    //return null;
    return ans;
}

function getPlayerIndexInGame(game, sessionID){
    var ans = -1;
    for (var i = 0; i < game.players.length; i++){
        if (sessionID == game.players[i]) {
            ans = i;
            break;
        }
    }
    return ans;
}

function isEndOfGame(game){
    var leftPlayers = game.leftPlayers;
    leftPlayers = leftPlayers || {};
    for (var i = 0; i < game.rounds.length; i++) {
        // if player left so end of game is closer
        if (leftPlayers[game.players[i]] !== undefined) continue;

        var len = game.rounds[i].length;
        if (len < 13 || game.rounds[i][len-1].combinationIndex == null) {
            return false;
        }
    }
    return true;
}
function endOfGame(game){
    game.status = 90;

    var leftPlayers = game.leftPlayers;
    leftPlayers = leftPlayers || {};

    game.results = [];
    game.winner = {index: "", name: "", result: 0};
    for (var i = 0; i < game.players.length; i++){
        var result = calculateResult(game.rounds[i]);
        game.results[i] = {name: game.names[i], result: result};
        if (result > game.winner.result) {
            game.winner.index = game.players[i];
            game.winner.name = game.names[i];
            game.winner.result = result;
        }

        //if (leftPlayers[game.players[i]] === undefined)
        //    connectedCookies[game.players[i]].status = 1;
    }

    console.log("game ends:", game);
}
function calculateResult(rounds){
    var ans = 0;

    var roundsPoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < rounds.length; i++){
        roundsPoints[rounds[i].combinationIndex] = rounds[i].points;
    }
    for (var j = 0; j < roundsPoints.length; j++){
        ans += roundsPoints[j];
        if (j == 5 && ans >= 63) ans += 35;
    }

    return ans;
}

function collectOnlineStatistics(){
    var data = {};
    data.playersOnline = Object.keys(connectedCookies).length;
    data.playersSearching = 0;
    data.activeGames = 0;
    for(var player in connectedCookies) {
        if (connectedCookies[player] !== undefined){
            if (connectedCookies[player].status == 2) {
                data.playersSearching++;
            }
        }
    }
    for (var game in games) {
        if (games[game] !== undefined){
            if (games[game].status == 20) data.activeGames++;
        }
    }
    return data;
}

app.get('/', function(req, res){
    var stats = collectOnlineStatistics();
    res.render('index', { title: 'NumbersGame', onlineStatistics: stats });
});
app.get('/play', function(req,res){
    res.render("play");
});
app.get('/onlineStatistics', function(req, res){
    var st=new Date();

    removeExpiredConnections();
    var st1 = st - new Date();

    // 10 last games
    var len = 10;
    var gamesToSend = {};
    for (var i = gamesIndex -1; i >=0 && Object.keys(gamesToSend).length < len; i--){
        var gName = "g" + i.toString();
        gamesToSend[gName] = games[gName];
    }
    var st2 = st - new Date();

    res.render("onlineStatistics", {
        serverTime: new Date(),
        connected: connectedCookies,
        games: gamesToSend
    });
    var st3 = st - new Date();
    console.log(st, st1, st2, st3);
});
app.get("/dropAll", function(req, res){
    connectedCookies = {};
    games = {};
    res.redirect("/onlineStatistics");
});
app.get("/reconfigure", function(req, res){
    configure();
    res.redirect("/");
});
app.get('/rules', function(req,res){
    res.render("rules");
});
app.get('/about', function(req,res){
    res.render("about");
});
app.get('/restartServer', function(req, res){
    res.render('restartServer', {title:'Restart server'});
});
app.post('/restartServer', function(req, res){
    console.log(req.body.name, req.body.password);
    res.redirect('/restartServer');
    // TODO, don't store passwords in code on github =)
    if(req.body.name && req.body.password){
        if (req.body.name=='jaric' && req.body.password=='1234'){
            restartServer();
        }
    }
});

// API
app.get('/api/dices', function(req, res){
    if (connectedCookies[req.sessionID] !== undefined){
        var game = findGameById(req.sessionID);
        if (game != null) {
            var playerIndex = getPlayerIndexInGame(game, req.sessionID);
            if (playerIndex == -1) console.log("error while generating dices, no player with such sessionID in this game", req.sessionID, game);

            var generateNewDices = true, notFinishedRoundIndex = -1;
            for (var i = 0; i < game.rounds[playerIndex].length; i++) {
                // if round not finished
                if (game.rounds[playerIndex][i].combinationIndex == null) {
                    notFinishedRoundIndex = i;
                    generateNewDices = false;
                    break;
                }
            }

            if (generateNewDices){
                if (game.rounds[playerIndex].length < 13) {
                    var dices = [generateDice(), generateDice(), generateDice(),
                        generateDice(), generateDice(), generateDice()];
                    //var combinationString = ""; for (var i =0; i<6; i++)
                    // combinationString += combo[i].toString();

                    var round = {};
                    round.dices = dices;
                    round.combinations = checkCombinations(dices);
                    round.rerolled = false;

                    game.rounds[playerIndex].push(round);

                    console.log(req.connection.remoteAddress, dices);//, JSON.stringify(game));
                    res.send({dices: dices, rerolled: round.rerolled});
                } else {
                    var lastDices = game.rounds[playerIndex][game.rounds[playerIndex].length-1].dices;
                    console.log("asking extra dices while game was over", lastDices);
                    res.send({dices: lastDices});
                }
            } else {
                console.log("updating not finished dices");
                var notFinishedDices = game.rounds[playerIndex][notFinishedRoundIndex].dices;
                res.send({
                    dices: notFinishedDices,
                    rerolled: game.rounds[playerIndex][notFinishedRoundIndex].rerolled
                });
            }

        } else {
            res.send(null);
        }
    } else {
        res.send(null);
    }
});
app.get('/api/dices/:dicesIndexes', function(req, res){
    if (connectedCookies[req.sessionID] !== undefined){
        var game = findGameById(req.sessionID);
        if (game != null) {
            var dlen = Math.min(6, req.params.dicesIndexes.length);

            var validDicesIndexes = true;
            for (var k = 0; k < dlen; k++) {
                if (req.params.dicesIndexes[k] < '0' || req.params.dicesIndexes[k] > '5') {
                    console.log("error, reroll dices indexes has wrong values:", req.params.dicesIndexes[k]);
                    validDicesIndexes = false;
                    break;
                }
            }

            if (validDicesIndexes){
                var playerIndex = getPlayerIndexInGame(game, req.sessionID);
                if (playerIndex == -1) console.log("error while rerolling dices, no player with such sessionID in this game", req.sessionID, game);

                var rIndex = game.rounds[playerIndex].length - 1;
                if (game.rounds[playerIndex][rIndex].rerolled) {
                    // sending last set of dices
                    res.send({
                        dices: game.rounds[playerIndex][rIndex].dices,
                        rerolled: game.rounds[playerIndex][rIndex].rerolled
                    });
                } else {
                    var dices = [];
                    for (var i = 0; i < dlen; i++){
                        dices.push(generateDice());
                    }

                    game.rounds[playerIndex][rIndex].olddices = [];
                    for (var m = 0; m < game.rounds[playerIndex][rIndex].dices.length; m++){
                        game.rounds[playerIndex][rIndex].olddices[m] = game.rounds[playerIndex][rIndex].dices[m];
                    }

                    for (var j = 0; j < dlen; j++){
                        game.rounds[playerIndex][rIndex].dices[ parseInt(req.params.dicesIndexes[j]) ] = dices[j];
                    }

                    game.rounds[playerIndex][rIndex].combinations = checkCombinations(game.rounds[playerIndex][rIndex].dices);
                    game.rounds[playerIndex][rIndex].rerolled = true;

                    console.log(req.connection.remoteAddress, dices);//, JSON.stringify(game));
                    //res.send(dices);
                    res.send({dices: game.rounds[playerIndex][rIndex].dices});
                }
            } else {
                console.log("error, not valid dices indexes to reroll");
                res.send(null);
            }

        } else {
            res.send(null);
        }
    } else {
        res.send(null);
    }
});
app.get('/api/combination/:comboIndex', function(req, res){
    if (connectedCookies[req.sessionID] !== undefined){
        var game = findGameById(req.sessionID);
        if (game != null) {
            var playerIndex = getPlayerIndexInGame(game, req.sessionID);
            if (playerIndex == -1) console.log("error while accepting combination, no player with such sessionID in this game", req.sessionID, game);

            var comboIndex = parseInt(req.params.comboIndex);
            if (req.params.comboIndex.length <= 2 && comboIndex != "NaN" && comboIndex >= 0 && comboIndex <= 12) {

                var validComboIndex = true;
                for (var i = 0; i < game.rounds[playerIndex].length; i++) {
                    if (game.rounds[playerIndex][i].combinationIndex == comboIndex) {

                        validComboIndex = false;
                        break;
                    }
                }

                if (validComboIndex){
                    var rIndex = game.rounds[playerIndex].length - 1;
                    game.rounds[playerIndex][rIndex].combinationIndex = comboIndex;
                    game.rounds[playerIndex][rIndex].points = game.rounds[playerIndex][rIndex].combinations[game.rounds[playerIndex][rIndex].combinationIndex];

                    // end of game
                    var gameEnds = false;
                    if (game.rounds[playerIndex].length == 13){
                        gameEnds = isEndOfGame(game);
                        if (gameEnds) endOfGame(game);
                    }

                    console.log(req.connection.remoteAddress);//, JSON.stringify(game));
                    res.send(game);
                } else {
                    console.log("error, such combination had been already used");
                    res.send(game);
                }

            } else {
                console.log("error, something wrong with comboIndex:", req.params.comboIndex);
                res.send(null);
            }
        } else {
            console.log("game not found (/api/combination/:comboIndex)");
            res.send(null);
        }
    } else {
        console.log("session not found (/api/combination/:comboIndex)");
        res.send(null);
    }
});
app.get('/api/giveup', function(req, res){
    if (connectedCookies[req.sessionID] !== undefined){
        connectedCookies[req.sessionID].status = 1;

        var game = findGameById(req.sessionID);
        if (game != null){

            // why game should finished for another one?
            //if (game.status != 90) { endOfGame(game); }
            if (game.leftPlayers === undefined) {
                game.leftPlayers = {};
            }
            game.leftPlayers[req.sessionID] = true;

            var isEnd = isEndOfGame(game);
            if (isEnd) endOfGame(game);

            res.send(null);
        } else {
            console.log("game not found (/api/giveup)");
            res.send(null);
        }
    } else {
        console.log("session not found (/api/giveup)");
        res.send(null);
    }
});

app.get("/api/connectPlayer", function(req, res){
    if (connectedCookies[req.sessionID] !== undefined){
        connectedCookies[req.sessionID].time = new Date();
        if (connectedCookies[req.sessionID].status === undefined) {
            //connectedCookies[req.sessionID].status = 2;
            connectedCookies[req.sessionID].status = 1;
        }
        //if (connectedCookies[req.sessionID].status == 80) connectedCookies[req.sessionID].status = 2;
    } else {
        connectedCookies[req.sessionID] = {};
        connectedCookies[req.sessionID].time = new Date();
        connectedCookies[req.sessionID].status = 1; // connected
        //connectedCookies[req.sessionID].status = 2; // 2 because we are skipping POST find game request
    }
    console.log(req._remoteAddress + ", players connected, onliners: " + Object.keys(connectedCookies).length.toString());
    var data = collectOnlineStatistics();
    data.sessionID = req.sessionID;

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

// connectedCookie status:
// 1 — connected
// 2 — searching for game
// 3 — play a game
app.get("/api/findGame", function(req, res){
    if (connectedCookies[req.sessionID] !== undefined){
        connectedCookies[req.sessionID].time = new Date();
        if (connectedCookies[req.sessionID].status == 1)
            connectedCookies[req.sessionID].status = 2;

        console.log(req._remoteAddress + ", searching for game, onliners: " + Object.keys(connectedCookies).length.toString());

        prepareGame();
        var game = findGameById(req.sessionID);
        console.log("game:", game ? game._id : null);//, JSON.stringify(game));
        if (game == null) {
            game = collectOnlineStatistics();

            res.send(game);
        } else {
            var playerIndex = getPlayerIndexInGame(game, req.sessionID);
            //game.playerIndex = playerIndex;
            var gameWithPlayerIndex = {playerIndex: playerIndex};
            _.extend(gameWithPlayerIndex, game);
            console.log("game to send (findGame):", gameWithPlayerIndex);

            res.send(gameWithPlayerIndex);
        }

        removeExpiredConnections();
    } else {
        res.send();
    }
});
app.get("/api/stopFindGame", function(req, res){
    if (connectedCookies[req.sessionID] !== undefined) {
        connectedCookies[req.sessionID].time = new Date();
        if (connectedCookies[req.sessionID].status == 2)
            connectedCookies[req.sessionID].status = 1;
        res.send("1");

        removeExpiredConnections();

        console.log(req._remoteAddress + ", stop find game, onliners: " + Object.keys(connectedCookies).length.toString());
    } else {
        res.send();
    }
});

app.get("/api/rounds/:gid", function(req, res){
    //console.log(req._remoteAddress + " GameProcess check" );

    //console.log("purchases: " + JSON.stringify(purchases));

    var data = {};
    var game;
    var gid = req.params.gid;
    if (gid != null && games[gid] !== undefined){
        game = games[gid];
    } else {
        game = findGameById(req.sessionID);
    }
    //console.log("game:", game._id);
    if (game) {
        //console.log("pIndex", req.session.id, game.playerIndex);

        res.send(game);

        if (connectedCookies[req.sessionID] !== undefined) {
            connectedCookies[req.sessionID].time = new Date();
        }
        removeExpiredConnections();
    } else {
        console.log("sending empty data:", data);
        res.send(data);
    }

});
app.get("/api/rounds/:gid/:datastring", function(req, res){
    if (connectedCookies[req.sessionID] !== undefined) {

        var gameId = req.params.gid;
        if (gameId != null) {
            //console.log("data from client:", JSON.parse(req.params.datastring));
            var data = JSON.parse(req.params.datastring);
        }

        //console.log(req._remoteAddress + " purchases " + req.body.purchase );
        res.send("1");

        connectedCookies[req.sessionID].time = new Date();
        removeExpiredConnections();
    }
});

app.get("/api/changeName/:name", function(req, res){

    console.log(req._remoteAddress + ", changing name");

    var ans = null;

    var name = req.params.name;
    if (name != null) {
        var reLogin = new RegExp("^[A-z0-9_-]{3,16}$");
        var loginMatch = reLogin.test(name);
        if (loginMatch) {

            if (connectedCookies[req.sessionID] !== undefined) {
                connectedCookies[req.sessionID].name = name;
                connectedCookies[req.sessionID].time = new Date();
            } else {
                var connectedCookie = {};
                connectedCookie.name = name;
                connectedCookie.time = new Date();
                //connectedCookie.status = 2; // 2 because we are skipping POST find game request

                connectedCookies[req.sessionID] = connectedCookie;
            }

            ans = {login: name};

            res.send(ans);

            removeExpiredConnections();
        } else {
            console.log("regexp fails");
            res.send(ans);
        }

    } else {
        console.log("no name");
        res.send(ans);
    }
});

app.get('/ang',function(req,res){
    res.render('angNumbers');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
