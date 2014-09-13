var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

var _ = require('underscore')._;

var app = express();

// default config
var config = {
    "minPlayers" : 1,
    "secret": "someSecret"
};

function readJSONFile(filepath, callback){
    fs.readFile(filepath, {encoding: "utf8"}, function(err, filedata){
        if (err) {
            console.log("read error:", err);
            callback(e, null);
        } else {
            // some hack with first symbol =/
            filedata = filedata.replace(/^\uFEFF/, '');
            // parsing file to JSON object
            var jsondata = JSON.parse(filedata);

            callback(null, jsondata);
        }
    });
}
function writeJSONFile(filepath, jsondata, callback){
    fs.writeFile(filepath, JSON.stringify(jsondata), {encoding: "utf8"}, function (err) {
        if (err) {
            console.log("write error:", err);
            callback(e, null);
        } else {
            console.log('File has been successfully written');
            callback();
        }
    });
}
function configure(){
    readJSONFile(path.join(__dirname, 'config.txt'), function(err, jsondata){
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
    });
}
// now default config should be loaded from config.txt file
configure();

// TODO. Looks like I've done it, but tricky and odd solution
// When service restarting it terminate parent process
// so chilren process terminate too. Thus child_process that had been
// executed can't finish process of restarting server.
// http://nodejs.org/api/child_process.html
// Advanced ci: http://www.carbonsilk.com/node/deploying-nodejs-apps/
// tags: ci, continious integration
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
//var execFile = require('child_process').execFile;
function restartServer(){
    //execFile('./restart.sh');
    //exec("sudo service node29 restart", function (error, stdout, stderr) {
    //    if (error !== null) console.log('exec error: ' + error);
    //});
    //spawn("sudo service node29 restart");
    //spawn("sudo", ['service', 'node29', 'restart']);

    // spawn will ruin server so Forever should back it up.
    spawn("sudo service node29 restart");
}
function updateServer(callback){
    // update from github
    exec("git --git-dir=" + path.join(__dirname, '.git') + " --work-tree=" + __dirname + " pull origin master", callback);
}

app.getHash = function(password){
    var hash = crypto.createHash('sha512');
    hash.update(password, 'utf8');

    return hash.digest('base64');
};

// all environments
app.set('port', process.env.PORT || 33322);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var staticFont = require('./staticFont');
app.use(staticFont());

app.use(express.favicon(path.join(__dirname, 'public','favicon.ico')));
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

var NumbersBase = require(path.join(__dirname, 'public', 'javascripts', 'NumbersBase.js'));

var generateDice = NumbersBase.generateDice;
var checkCombinations = NumbersBase.checkCombinations;

//console.log("small test", generateDice(), checkCombinations("134256"));

var value = 0;

var connectedCookies = {};

var gamesCounter = 0;
var games = {};
var gamesInProgress = {};

function prepareIpToConsole(req){
    return 'ip:'+req.connection.remoteAddress;
}
function removeExpiredConnections(){
    var curTime = new Date();

    // http://jsperf.com/stackoverflow-for-vs-hasownproperty/7
    // V8 shows that hasOwnProperty is really slower than object[key] find

    for (var key in connectedCookies) {
        //if (connectedCookies.hasOwnProperty(key)) {
        if (connectedCookies[key] !== undefined) {
            //console.log ( (curTime - connectedCookies[key]).toString() );
            if (Math.abs(curTime - connectedCookies[key].time) > 600000) {   // 10 min

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
                                    if (game.status != 90){
                                        game.status = -1;
                                        game.endTime = new Date();
                                        game.duration = game.endTime - game.startTime;  // ms
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
        var gameId = "g" + gamesCounter.toString();
        gamesCounter++;

        var game = {};
        games[gameId] = game;
        game._id = gameId;
        game.players = [];
        game.status = 20;
        game.startTime = new Date();

        for (var i = 0; i < len; i++) {
            if (i==0) {
                //game.settings = connectedCookies[wannaPlayers[i]].settings;
                //game.boxes = connectedCookies[wannaPlayers[i]].boxes;
            }

            var userSessionId = wannaPlayers[i];
            game.players.push(userSessionId);
            if (game.names == null) game.names = [];

            var connectedCookie = connectedCookies[userSessionId];
            var playerName = "";
            if (connectedCookie.name == null){
                connectedCookie.name = "player" + (10000 * Math.random()).toFixed(0);
            }
            game.names.push(connectedCookie.name);

            if (game.rounds == null) game.rounds = [];
            game.rounds.push([]);

            connectedCookie.status = 3;
        }
        console.log("names:", game.names, 'in game', game._id);//, JSON.stringify(game));
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
    //for (var i = gamesCounter-1; i >=0; i--){
        //var gInd = "g" + gamesCounter.toString();
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
    game.endTime = new Date();
    game.duration = game.endTime - game.startTime;  // ms

    console.log("game ends:", game._id);
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
    removeExpiredConnections();

    var stats = collectOnlineStatistics();
    res.render('index', { onlineStatistics: stats });
});
app.get('/play', function(req,res){
    res.render("play");
});
app.get('/onlineStatistics', function(req, res){
    var st = new Date();
    removeExpiredConnections();

    // 10 last games
    var len = 10;
    var addedGamesCounter = 0;
    var gamesToSend = {};
    for (var i = gamesCounter -1; i >=0 && addedGamesCounter < len; i--){
        var gName = "g" + i.toString();
        var originalGame = games[gName];
        var game = {};
        gamesToSend[gName] = game;
        game.players = [];
        for (var j = 0; j < originalGame.names.length; j++) {
            if (originalGame.results !== undefined){
                game.players.push(originalGame.results[j]);
            } else {
                game.players.push({name: originalGame.names[j]});
            }
        }
        game.duration = originalGame.duration;

        addedGamesCounter++;
    }
    var cookiesToSend = [];
    for (var key in connectedCookies) {
        var connectedCookie = connectedCookies[key];
        if (connectedCookie !== undefined) {
            if (connectedCookie.name !== undefined)
                cookiesToSend.push(connectedCookie.name);
            else
                cookiesToSend.push(' ');
        }
    }

    res.render("onlineStatistics", {
        serverTime: new Date(),
        connected: cookiesToSend,
        games: gamesToSend
    });
    var st3 = new Date() - st;
    console.log('new onlineStatistics: ', st3);
});
app.get('/onlineStatisticsFull', function(req, res){
    var st = new Date();

    removeExpiredConnections();
    var st1 = new Date() - st;

    // 10 last games
    var len = 10;
    var addedGamesCounter = 0;
    var gamesToSend = {};
    for (var i = gamesCounter -1; i >=0 && addedGamesCounter < len; i--){
        var gName = "g" + i.toString();
        gamesToSend[gName] = games[gName];

        addedGamesCounter++;
    }
    var st2 = new Date() - st;

    res.render("onlineStatisticsFull", {
        serverTime: new Date(),
        connected: connectedCookies,
        games: gamesToSend
    });
    var st3 = new Date() - st;
    console.log('expired cleared: ', st1,
        ', ten last games found: ', st2,
        ', template rendered: ', st3);
});
/*
app.get("/dropAll", function(req, res){
    connectedCookies = {};
    games = {};
    res.redirect("/onlineStatisticsFull");
});
*/
app.get("/reconfigure", function(req, res){
    configure();
    res.redirect("/");
});
app.get("/reconfigure/:num", function(req, res){
    var num = req.params.num[0];
    if ('0' < num && num < '5') {
        num = parseInt(num);
        var filepath = path.join(__dirname, 'config.txt');
        readJSONFile(filepath, function(err, jsondata){
            jsondata.minPlayers = num;
            writeJSONFile(filepath, jsondata, function(){

                configure();
            });
        });
    } else {
        console.log('reconfigure failed');
    }
    res.redirect("/");
});
app.get('/rules', function(req,res){
    res.render("rules");
});
app.get('/about', function(req,res){
    res.render("about");
});
app.get('/restartServer', function(req, res){
    res.render('restartServer');
});
app.post('/restartServer', function(req, res){
    console.log('going to restart server', prepareIpToConsole(req));
    if(req.body.name && req.body.password){
        console.log(req.body.name, req.body.updateOnly);
        var passHash = req.app.getHash(req.body.password);
        if (req.body.name=='jaric' && passHash=='bXSdeiUOrFs6OEO6jzlsXMVatr0V3ih4t8EpDLbh7b6y5mbV5uk1f5XD2na5oSWRYyY9mSg9rGauTr7rI01plA=='){
            if (req.body.updateOnly !== undefined && req.body.updateOnly == 'on') {
                updateServer(function(error, stdout, stderr){
                    if (!error){
                        res.render('restartServer', {
                            message: 'successfully updated',
                            serverTime: new Date(),
                            error: JSON.stringify(error),
                            stdout: JSON.stringify(stdout),
                            stderr: JSON.stringify(stderr)
                        });
                    } else {
                        res.render('restartServer', {
                            message:'something goes wrong',
                            serverTime: new Date(),
                            error: JSON.stringify(error),
                            stdout: JSON.stringify(stdout),
                            stderr: JSON.stringify(stderr)
                        });
                    }
                });
            } else {
                updateServer(function(error, stdout, stderr){
                    if (!error){
                        res.render('restartServer', {
                            message: 'successfully updated and going to reboot',
                            serverTime: new Date(),
                            error: JSON.stringify(error),
                            stdout: JSON.stringify(stdout),
                            stderr: JSON.stringify(stderr)
                        });
                    } else {
                        res.render('restartServer', {
                            message:'something goes wrong with update and going to reboot',
                            serverTime: new Date(),
                            error: JSON.stringify(error),
                            stdout: JSON.stringify(stdout),
                            stderr: JSON.stringify(stderr)
                        });
                    }
                    restartServer();
                });
            }
        } else res.send('No, inc');
    } else res.send('No');
});

// Strange bug was detected, while accepting combo and requesting new dices (WinPhone), last combination was rewrited, I've done some changes but not sure if bug fixed
// API
app.get('/api/dices', function(req, res){
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined){
        var game = findGameById(req.sessionID);
        if (game != null) {
            var playerIndex = getPlayerIndexInGame(game, req.sessionID);
            if (playerIndex == -1) console.log("error while generating dices, no player with such sessionID in this game", req.sessionID, game);

            var playerRounds = game.rounds[playerIndex];
            var generateNewDices = true, notFinishedRoundIndex = -1;
            for (var i = 0; i < playerRounds.length; i++) {
                // if round not finished
                if (playerRounds[i].combinationIndex == null) {
                    notFinishedRoundIndex = i;
                    generateNewDices = false;
                    break;
                }
            }

            if (generateNewDices){
                if (playerRounds.length < 13) {
                    var dices = [];
                    for (var j = 0; j < 6; j++) dices.push(generateDice());
                    //var combinationString = ""; for (var i =0; i<6; i++)
                    // combinationString += combo[i].toString();

                    var round = {};
                    round.dices = dices;
                    round.combinations = checkCombinations(dices);
                    round.rerolled = false;

                    playerRounds.push(round);

                    console.log('sending new dices to ',prepareIpToConsole(req), dices);//, JSON.stringify(game));
                    res.send({dices: dices, rerolled: round.rerolled});
                } else {
                    var lastDices = playerRounds[playerRounds.length-1].dices;
                    console.log("asking extra dices while game was over", lastDices);
                    res.send({dices: lastDices});
                }
            } else {
                console.log("updating not finished dices");
                var notFinishedDices = playerRounds[notFinishedRoundIndex].dices;
                res.send({
                    dices: notFinishedDices,
                    rerolled: playerRounds[notFinishedRoundIndex].rerolled
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
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined){
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

                    console.log(prepareIpToConsole(req), dices);//, JSON.stringify(game));
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
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined){
        var game = findGameById(req.sessionID);
        if (game != null) {
            var playerIndex = getPlayerIndexInGame(game, req.sessionID);
            if (playerIndex == -1) console.log("error while accepting combination, no player with such sessionID in this game", req.sessionID, game);

            var comboIndex = parseInt(req.params.comboIndex);
            if (req.params.comboIndex.length <= 2 && comboIndex != "NaN" && comboIndex >= 0 && comboIndex <= 12) {

                var playerRounds = game.rounds[playerIndex];
                var validComboIndex = true;
                for (var i = 0; i < playerRounds.length; i++) {
                    if (playerRounds[i].combinationIndex == comboIndex) {

                        validComboIndex = false;
                        break;
                    }
                }

                if (validComboIndex){
                    var rIndex = playerRounds.length - 1;
                    playerRounds[rIndex].combinationIndex = comboIndex;
                    playerRounds[rIndex].points = playerRounds[rIndex].combinations[playerRounds[rIndex].combinationIndex];

                    // end of game
                    var gameEnds = false;
                    if (playerRounds.length == 13){
                        gameEnds = isEndOfGame(game);
                        if (gameEnds) endOfGame(game);
                    }

                    console.log('accepted combo', comboIndex, 'from', prepareIpToConsole(req));//, JSON.stringify(game));
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
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined){
        connectedCookie.status = 1;

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
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined){
        connectedCookie.time = new Date();
        if (connectedCookie.status === undefined) {
            //connectedCookie.status = 2;
            connectedCookie.status = 1;
        }
        //if (connectedCookie.status == 80) connectedCookie.status = 2;
    } else {
        connectedCookie = {};
        connectedCookies[req.sessionID] = connectedCookie;
        connectedCookie.time = new Date();
        connectedCookie.status = 1; // connected
        //connectedCookie.status = 2; // 2 because we are skipping POST find game request
    }
    console.log(req._remoteAddress + ", players connected, onliners: " + Object.keys(connectedCookies).length.toString());
    var data = collectOnlineStatistics();
    data.sessionID = req.sessionID;

    res.send(data);
    removeExpiredConnections();
});
app.get("/api/disconnectPlayer", function(req, res){
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined) {
        connectedCookie.time = 0;
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
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined){
        connectedCookie.time = new Date();
        if (connectedCookie.status == 1)
            connectedCookie.status = 2;

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
            //console.log("game to send (findGame):", gameWithPlayerIndex);

            res.send(gameWithPlayerIndex);
        }

        removeExpiredConnections();
    } else {
        res.send();
    }
});
app.get("/api/stopFindGame", function(req, res){
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined) {
        connectedCookie.time = new Date();
        if (connectedCookie.status == 2)
            connectedCookie.status = 1;
        res.send("1");

        removeExpiredConnections();

        console.log(prepareIpToConsole(req) + ", stop find game, onliners: " + Object.keys(connectedCookies).length.toString());
    } else {
        res.send();
    }
});

app.get("/api/rounds/:gid", function(req, res){
    //console.log(prepareIpToConsole(req) + " GameProcess check" );

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

        var connectedCookie = connectedCookies[req.sessionID];
        if (connectedCookie !== undefined) {
            connectedCookie.time = new Date();
        }
        removeExpiredConnections();
    } else {
        console.log("sending empty data:", data);
        res.send(data);
    }

});
app.get("/api/rounds/:gid/:datastring", function(req, res){
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined) {

        var gameId = req.params.gid;
        if (gameId != null) {
            //console.log("data from client:", JSON.parse(req.params.datastring));
            var data = JSON.parse(req.params.datastring);
        }

        res.send("1");

        connectedCookie.time = new Date();
        removeExpiredConnections();
    }
});

app.get("/api/changeName/:name", function(req, res){

    console.log(prepareIpToConsole(req) + ", changing name");

    var ans = null;

    var name = req.params.name;
    if (name != null) {
        //var reLogin = new RegExp("^[A-z0-9_-]{3,16}$");
        //var loginMatch = reLogin.test(name);
        var loginMatch = 0 < name.length && name.length < 17;
        if (loginMatch) {
            console.log("changing name to", name);

            var connectedCookie = connectedCookies[req.sessionID];
            if (connectedCookie === undefined) {
                connectedCookie = {};
                connectedCookies[req.sessionID] = connectedCookie;
                //connectedCookie.status = 2; // 2 because we are skipping POST find game request
            }
            connectedCookie.name = name;
            connectedCookie.time = new Date();

            var game = findGameById(req.sessionID);
            if (game != null){
                var ind = 0;
                for (; ind < game.players.length; ind++)
                    if (game.players[ind] == req.sessionID)
                        break;
                if (ind != game.players.length) {
                    game.names[ind] = connectedCookie.name;
                }
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

app.get("/api/getName", function(req, res){
    var connectedCookie = connectedCookies[req.sessionID];
    if (connectedCookie !== undefined) {
        console.log(prepareIpToConsole(req) + ", getting name");

        var ans = {login: null};

        console.log('connectedCookie:', JSON.stringify(connectedCookie));
        if (connectedCookie.name !== undefined){
            ans.login = connectedCookie.name;
        }

        res.send(ans);
        removeExpiredConnections();
    } else {
        res.send(null);
    }
});

app.get('/ang',function(req,res){
    res.render('angNumbers');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
