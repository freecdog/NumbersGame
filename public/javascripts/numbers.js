/**
 * Created by jaric on 07.07.14.
 */

(function($) {
    var NumbersBase = window.NumbersBase;
    var generateDice = NumbersBase.generateDice;
    var checkCombinations = NumbersBase.checkCombinations;
    //console.log("small test", NumbersBase.generateDice(), generateDice());

    $.numbers = {};

    // Models

    // status definition in rules
    $.numbers.Game = Backbone.Model.extend( {
        urlRoot: '/api/connectPlayer',
        idAttribute: '_id',
        defaults: {
            '_id':  null,
            'status': 0,
            combinations: null
        },
        initialize: function() {
            //this.listenTo(this, 'change', this.statusChanged);
            //this.updateModel();
        }
        /*statusChanged: function(){
            var needUpdate = true;
            if (this.status == 0) {
                this.urlRoot = '/api/connectPlayer';
            } else if (this.status == 10) {
                this.urlRoot = '/api/findGame';
            } else {
                needUpdate = false;
                console.warn("unknown game status:",this);
            }
            if (needUpdate){
                this.updateModel();
            }
        },
        updateModel: function(callback){
            if (callback == null) callback = function(){};
            this.fetch({
                success: function(mdl, values){
                    callback();
                },
                error: function(mdl, values){
                    console.log("Can't update", mdl, values);
                    callback();
                }
            });
        }*/
    });

    // TODO, develop syncStorageWithMemory
    // TODO, scroll top after choosing combo isn't correct behaviour
    // TODO, refresh page (f5) when game was end leeds to api/findGame but game can't be find (because status 3 of player), so user see Status 10 findGame forever =)
    // TODO, work with game status == -1, when fires removeExpiredConnections()

    $.numbers.Combination = Backbone.Model.extend({
        urlRoot: '/api/dices',
        //idAttribute: 'id',
        defaults: {
            '_id':  null,
            status: 0,
            dices: [0, 0, 0, 0, 0, 0],
            combinations: [],

            clickable: true,
            observerIndex: -1
        },

        initialize: function() {
            // localStorage - sync values among all tabs
            // sessionStorage - keep values only in one tab
            this.storage = localStorage; //document.cookie; //localStorage; //sessionStorage;

            this.updateRate = 1000; // ms
            this.lastUpdateTime = 0;

            this.restartListener();
            this.statusChanged();

            this.clearStates();

            // is it needed on init? Think no, but may be it should be "on" for offline version
            //this.updateDices();
        },

        clearStates: function(){
            // it doesn't looks like good code
            //this.rerolled = false;
            this.unset("rerolled");
            this.rerolled = false;
            this.set({rerolled: false});
            this.unset("currentSelected");
            this.currentSelected = [false, false, false, false, false, false];
            this.set({currentSelected: [false, false, false, false, false, false]});

            this.unset("clickable");
            this.clickable = true;
            this.set({clickable: true});
            this.unset("observerIndex");
            this.observerIndex = -1;
            this.set({observerIndex: -1});
        },

        restartListener: function(){
            this.stopListening();
            this.listenTo(this, 'change:status', this.statusChanged);
            this.listenTo(this, 'change:rerolled', this.statusChanged);
        },

        statusChanged: function(){
            console.log("status changed");
            var needUpdate = true;
            var status = this.attributes.status;
            if (status == 0) {
                this.urlRoot = '/api/connectPlayer';

                // if pushing restart button and there is still a game (status == 20) update rate become much more than 2 sec
                // with this restartListener, problem become smaller, but still not gone
                this.restartListener();
            } else if (status == 10) {
                this.urlRoot = '/api/findGame';
            } else if (status == 20) {
                this.updateDices();
                this.urlRoot = '/api/rounds/' + this.attributes._id;
            } else if (status == 70) {
                this.urlRoot = '/api/giveup';
            } else if (status == 90) {
                needUpdate = false;
                console.log("game is over");
                //this.urlRoot = '/api/rounds/' + this.attributes._id;
            } else if (status == -1) {
                needUpdate = false;
                console.log("game is abandoned");
            } else {
                needUpdate = false;
                console.warn("unknown game status:",this.attributes.status, this);
            }
            if (needUpdate){
                this.updateModel();
            }
        },
        updateModel: function(){
            var self = this;
            var currentUrl = this.urlRoot;
            // if there are urlRoot and attributes.id it will be fetched urlRoot + / + id
            if (this.attributes.status != 20) {
                console.log("going to fetch", currentUrl);
            }
            this.fetch({
                success: function(mdl, values){
                    //console.log("fetched:", mdl, values);
                    if (values.status != null && mdl._previousAttributes.status != values.status) {
                        console.log("fetched new status:", values.status != null && mdl._previousAttributes.status != values.status, values.status);
                    } else {
                        console.log("fetched new status:", values.status != null && mdl._previousAttributes.status != values.status);
                    }
                    var status = self.attributes.status;
                    if (status == 0) {
                        self.changeStatus(10);
                    } else if (status == 10) {
                        if (new Date() - self.lastUpdateTime > self.updateRate) {
                            self.lastUpdateTime = new Date();
                            setTimeout(function () {
                                self.updateModel();
                            }, self.updateRate);
                        } else {
                            console.log("going to update too early", status);
                        }
                    } else if (status == 20) {
                        if (self._previousAttributes.status == 70) {
                            self.changeStatus(10);
                        } else {

                            //console.log("process fetched:", mdl, values);
                            // there were a problem about twice fetching, but with this if it looks fine
                            if (new Date() - self.lastUpdateTime > self.updateRate) {
                                self.lastUpdateTime = new Date();
                                setTimeout(function(){
                                    self.updateModel();
                                }, self.updateRate);
                            } else {
                                console.log("going to update too early", status);
                            }
                        }

                    } else if (status == 90) {
                        if (self._previousAttributes.status == 70) {
                            self.changeStatus(0);
                        }
                        // refresh (f5) behaviour when game already ended
                        if (self.attributes.combinations.length == 0) {
                            var ind = self.getOwnPlayerIndex();
                            var rlen = self.attributes.rounds[ind].length;
                            self.setDices(self.attributes.rounds[ind][rlen-1].dices);
                        }
                    }
                },
                error: function(mdl, values, xhr){
                    var status = self.attributes.status;
                    console.warn("actually error", status, currentUrl);
                    if (status == 10) {
                        if (values.status == 200) {
                            console.warn("there were case with fetching here, but now it's moved to success");
                        } else {
                            console.warn("Connection eRRoRR", mdl, values, xhr);
                        }
                    } else if (status == 70) {
                        self.changeStatus(0);
                    } else if (status == 90) {
                        if (self._previousAttributes.status == 70) {
                            self.changeStatus(0);
                        }
                    } else {
                        console.warn("Connection error, status:", status, mdl, values, xhr);
                    }
                }
            });
        },
        changeStatus: function(value){
            this.set({status: value});
        },

        updateDices: function(){
            if ($.numbers.networking == false) {
                if (this.existValue("lastDices")){
                    if (this.getValue("lastDices") == "undefined") {
                        console.warn("storaged dices was undefined");
                        this.removeValue("lastDices");
                        this.updateDices();
                    }
                    console.log("dices exist");
                    this.setDices(JSON.parse(this.getValue("lastDices")));
                } else {
                    console.log("generating dices");
                    this.generateCombination();
                }
            } else {
                console.log("fetching dices");
                var prevUrlRoot = this.urlRoot;
                this.urlRoot = "/api/dices";
                this.generateCombination();
                this.urlRoot = prevUrlRoot;
            }
            /*if (this.existValue("lastDices")){
                if (this.getValue("lastDices") == "undefined") {
                    console.warn("storaged dices was undefined");
                    this.removeValue("lastDices");
                    this.updateDices();
                }
                console.log("dices exist");
                this.setDices(JSON.parse(this.getValue("lastDices")));
            } else {
                console.log("fetching dices");
                var prevUrlRoot = this.urlRoot;
                this.urlRoot = "/api/dices";

                this.generateCombination();

                this.urlRoot = prevUrlRoot;
            }*/
            /*console.log("fetching dices");
            var prevUrlRoot = this.urlRoot;
            this.urlRoot = "/api/dices";

            this.generateCombination();
            this.urlRoot = prevUrlRoot;*/
        },
        getDices: function(callback) {
            if (callback == null) callback = function(){};
            var ans = [0, 0, 0, 0, 0, 0];
            if ($.numbers.networking == false) {
                for (var i = 0; i < 6; i++) ans[i] = generateDice();
            } else {
                this.fetch({
                    success: function(mdl, directValues){
                        ans = directValues.dices;
                        callback(ans);
                    },
                    error: function(mdl, values){
                        if (values.status == 200)
                            console.warn("connection error in getDice",mdl, values);
                        else
                            console.error("connection error in getDice",mdl, values);
                        callback();
                    }
                });
            }
            return ans;
        },
        setDices: function(dices){
            // from http://stackoverflow.com/questions/15336801/backbone-js-change-event-not-firing-when-value-is-same-as-previous-value-prior-t
            // unset should lead to set event even if new dice are same to previous one
            this.unset("dices", {silent: true});
            this.dices = dices;
            this.set({dices: dices});
            var cmbs = checkCombinations(dices);
            this.unset("combinations", {silent: true});
            this.combinations = cmbs;
            this.set({combinations: cmbs});
        },

        toggleDice: function(index, value){
            this.attributes.currentSelected[index] = value;
        },
        reroll: function(indexes){
            var self = this;
            var i = 0;
            if ($.numbers.networking == false) {
                for (i = 0; i < indexes.length; i++) {
                    this.attributes.dices[ indexes[i] ] = generateDice();
                    this.attributes.currentSelected[ indexes[i] ] = false;
                }
                self.setDices(self.attributes.dices);
            } else {
                var prevUrlRoot = this.urlRoot;

                //this.urlRoot += "/";
                this.urlRoot = "/api/dices/";
                for (i = 0; i < indexes.length; i++){
                    this.urlRoot += indexes[i].toString();
                }
                console.log("going to fetch rerolled dices", this.urlRoot);

                this.fetch({
                    success: function(mdl, values){
                        //for (i = 0; i < indexes.length; i++) {
                        //    self.attributes.dices[ indexes[i] ] = parseInt(values[i]);
                        //    self.attributes.currentSelected[ indexes[i] ] = false;
                        //}
                        self.attributes.dices = values.dices;
                        for (i = 0; i < 6; i++) {self.attributes.currentSelected[i] = false;}

                        self.setDices(self.attributes.dices);
                        console.log("rerolled dices", self.attributes.dices);
                        //self.urlRoot = prevUrlRoot;
                    },
                    error: function(mdl, values){
                        console.error("connection error while reroll", mdl, values);
                        //self.urlRoot = prevUrlRoot;
                    }
                });
                self.urlRoot = prevUrlRoot;
            }
        },
        // reroll all checked dice, rerollMode
        rerollDices: function(){
            if (this.attributes.rerolled == false) {
                var indexes = [];
                for (var i = 0; i < this.attributes.currentSelected.length; i++) {
                    if (this.attributes.currentSelected[i] == true) indexes.push(i);
                }
                if (indexes.length > 0) {
                    //this.rerolled = true;
                    this.set({rerolled: true});
                    this.reroll(indexes);
                }
            } else {
                console.log("already rerolled");
            }
        },

        acceptCombination: function(index){
            if (index != -1) {
                var combo = {};
                combo.dices = this.attributes.dices;
                combo.combinationIndex = index;
                combo.points = this.attributes.combinations[index];

                if (this.checkCombination(index)) {
                    var totalRounds = this.addCombination(combo);
                    this.removeValue("lastDices");
                    console.log("lastDices removed, combo added", combo);

                    //this.rerolled = false;
                    this.unset("rerolled", {silent: true});
                    this.rerolled = false;
                    this.set({rerolled: false});

                    var self = this;
                    this.sendCombination(combo, function(){
                        if (totalRounds != 13) {
                            // additional remove lastDices for correct update, too much triggers =/
                            self.removeValue("lastDices");
                            self.updateDices();
                        } else {
                            // there is additional setDices, because for some reason it won't to render
                            self.setDices([0, 0, 0, 0, 0, 0]);
                            self.setDices(combo.dices);
                        }
                    });

                    // generating new combination
                    //this.generateCombination();
                    //this.updateDices();
                    return true;
                } else {
                    console.log("can't add combo");
                    return false;
                }
            } else {
                console.log("nothing was taked");
                return false;
            }
        },
        generateCombination: function(){
            var self = this;
            self.getDices(function(dices){
                if (typeof dices == "undefined") {
                    console.warn("fetched dices are undefined");
                    //self.addValue("lastDices", JSON.stringify(dices));
                    //self.setDices(dices);
                } else {
                    self.addValue("lastDices", JSON.stringify(dices));
                    self.setDices(dices);
                }
            });
        },
        checkCombination: function(index){
            var available = true;
            var usedCombos = this.getUsedCombinations();
            if (usedCombos.length != 0){
                for (var i = 0; i < usedCombos.length; i++){
                    if (usedCombos[i] == index){
                        available = false;
                        break;
                    }
                }
            }
            return available;
        },
        addCombination: function(combo){
            var combos = [];
            if (this.existValue("combinations")){
                combos = JSON.parse( this.getValue("combinations") );
                combos.push(combo);
                console.log("total combinations: ", combos.length);
            } else {
                combos.push(combo);
            }
            this.addValue("combinations", JSON.stringify(combos));
            return combos.length;
        },
        getCombinationByIndex: function(index){
            if (this.existValue("combinations")){
                var combos = JSON.parse( this.getValue("combinations") );
                for (var i = 0; i < combos.length; i++){
                    if (combos[i].combinationIndex == index) {
                        return combos[i];
                    }
                }
            }
            console.log("no combination with such index:", index);
            return null;
        },
        getUsedCombinations: function(){
            var combosIndexes = [];
            var combos;
            //if ($.numbers.networking){
            //    var index = this.getOwnPlayerIndex();
            //    combos = this.attributes.rounds[index];
            //}
            if (this.existValue("combinations")) {
                combos = JSON.parse(this.getValue("combinations"));
            } else {
                combos = [];
            }
            for (var i = 0; i < combos.length; i++) {
                combosIndexes.push(combos[i].combinationIndex);
            }
            return combosIndexes;
        },
        getUsedCombinationsMemory: function(index){
            var combosIndexes = [];
            var combos;
            combos = this.attributes.rounds[index];
            for (var i = 0; i < combos.length; i++) {
                if (combos[i].combinationIndex) {
                    combosIndexes.push(combos[i].combinationIndex);
                }
            }
            return combosIndexes;
        },
        getCombinationByIndexMemory: function(playerIndex, index){
            var combos = this.attributes.rounds[playerIndex];
            for (var i = 0; i < combos.length; i++){
                if (combos[i].combinationIndex == index) {
                    return combos[i];
                }
            }
            console.log("no combination with such index:", index);
            return null;
        },
        sendCombination: function(combo, callback){
            var prevUrlRoot = this.urlRoot;
            // probably we will need encodeURIComponent() or encodeURI, and decodeURI on server side
            //this.urlRoot = "/api/rounds/" + this.attributes._id + "/" + JSON.stringify(combo);

            this.urlRoot = "/api/combination/" + combo.combinationIndex.toString();

            console.log("going to send combination", this.urlRoot);
            this.fetch({
                success: function(mdl, values){
                    console.log("combination sent", mdl, values);
                    if (callback != null) {
                        console.log("running callback, probably it is dices fetch");
                        callback();
                    }
                },
                error: function(mdl, values){
                    console.error("connection error while sending combination", mdl, values);
                }
            });

            this.urlRoot = prevUrlRoot;
        },

        calculate: function(){
            var ans = 0;
            var combosPoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            if (this.existValue("combinations")){
                var combos = JSON.parse( this.getValue("combinations") );
                for (var i = 0; i < combos.length; i++){
                    combosPoints[combos[i].combinationIndex] = (combos[i].points);
                }
            }
            for (var j = 0; j < combosPoints.length; j++){
                ans += combosPoints[j];
                if (j == 5 && ans >= 63) ans += 35;
            }
            return ans;
        },
        calculatePlayer: function(index){
            var ans = 0;
            var combosPoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var combos = this.attributes.rounds[index];
            for (var i = 0; i < combos.length; i++){
                combosPoints[combos[i].combinationIndex] = (combos[i].points);
            }
            for (var j = 0; j < combosPoints.length; j++){
                ans += combosPoints[j];
                if (j == 5 && ans >= 63) ans += 35;
            }
            return ans;
        },

        restart: function(){
            this.removeValue("combinations");
            this.removeValue("lastDices");
            this.attributes.status = 70;
            this.initialize();
        },

        getOwnPlayerIndex: function(){
            var ans = -1;
            for (var i = 0; i < this.attributes.names.length; i++){
                if (this.attributes.players[i] == this.attributes.sessionID){
                    ans = i;
                    break;
                }
            }
            return ans;
        },

        viewAnotherModel: function(playerIndex){
            var ans = {};
            ans.clickable = this.getOwnPlayerIndex() == playerIndex;
            var rlen = this.attributes.rounds[playerIndex].length;
            ans.dices = this.attributes.rounds[playerIndex][rlen - 1].dices;
            ans.rerolled = this.attributes.rounds[playerIndex][rlen - 1].rerolled;
            ans.observerIndex = playerIndex;

            //console.warn("now I do nothing");
            this.set({clickable: ans.clickable, observerIndex: ans.observerIndex});
        },

        syncStorageWithMemory: function(){
            if (this.attributes.rounds &&
                this.existValue("combinations") &&
                this.existValue("lastDices"))
            {
                console.log("syncing local storage with server");

                var turns = JSON.parse(this.getValue("combinations"));
                var lastDices = JSON.parse(this.getValue("lastDices"));

                var playerIndex = this.getOwnPlayerIndex();
                var rounds = this.attributes.rounds[playerIndex];

                var isEqual = true;
                if (turns.length != rounds.length) {
                    isEqual = false;
                }
                if (isEqual) {
                    function equalArrays(a1, a2){
                        if (!a2 || a1.length != a2.length) {
                            return false;
                        }
                        for (var i = 0; i < a1.length; i++) {
                            if (a1[i] !== a2[i]) {
                                return false;
                            }
                        }
                        return true;
                    }

                    // equality of two objects
                    for (var i = 0; i < turns.length; i++) {
                        for (var j = 0; j < rounds.length; j++) {
                        }
                    }
                }

                if (isEqual == false) {
                    // feel turns
                }

                return true;
            } else {
                console.warn("sync storage failed");
                return false;
            }
        },
        // storage
        addValue: function(name,value){
            this.storage.setItem(name, value);
        },
        getValue: function(name){
            return this.storage.getItem(name);
        },
        existValue: function(name){
            return this.storage.getItem(name) != null;
        },
        removeValue: function(name){
            this.storage.removeItem(name);
        }
    });

    $.numbers.ModelConnection = Backbone.Model.extend({
        urlRoot: '/api/connectPlayer',
        initialize: function(callback) {
            //console.error("we need some code here");
            if (callback == null) callback = function(){};
            this.fetch({
                success: function(mdl, values){
                    $.numbers.networking = true;
                    console.log("connection fetched", mdl, values);
                    callback();
                },
                error: function(mdl, values){
                    $.numbers.networking = false;
                    console.error("Can't connect to server", mdl, values);
                    callback();
                }
            });
        }
    });

    // Views
    $.numbers.RestartButton = Backbone.View.extend({
        tagName: 'div',
        className: 'restartGameButton',
        events: {
            "click": "clicked"
        },
        clicked: function(){
            console.log("going to restart");
            //this.options.parent.model.restart();
            //$.numbers.app.combinationModel.restart();
            var model = this.options.parent.model;
            var status = model.attributes.status;
            var needConfirmation = status != 90 && status != -1;
            if (needConfirmation) {
                var confirmed = confirm("Leave this game and start new one?");
                if (confirmed) {
                    $.numbers.app.doRestart();
                }
            } else {
                $.numbers.app.doRestart();
            }
        },
        buttonTemplate: _.template("[restart]"),
        render: function() {
            this.$el.empty();
            this.$el.append(this.buttonTemplate());
            return this;
        }
    });
    $.numbers.RerollButton = Backbone.View.extend({
        tagName: 'div',
        className: 'rerollButton',
        events: {
            "click": "clicked"
        },
        initialize: function(){
            this.listenTo(this.model, "change:rerolled", this.changedRerollStatus);
        },
        changedRerollStatus: function(){
            //console.warn("reroll status changed", this.model.attributes.rerolled);
            this.render();
        },
        clicked: function(){
            console.log("going to reroll", this.options.parent, this.model);
            //this.options.parent.model.rerollDices();
            //$.numbers.app.combinationModel.rerollDices();
            $.numbers.app.doReroll();
        },
        buttonTemplate: _.template("[reroll]"),
        render: function() {
            this.$el.empty();
            this.$el.append(this.buttonTemplate());
            if (this.model.attributes.rerolled) {
                //console.log("adding class Selected to reroll button");
                this.$el.addClass('used');
                //this.$el.removeAttr("background-color");
                //this.$el.css("background-color", "#fff");
                //this.$el.empty();
            } else {
                this.$el.removeClass('used');
                //console.log("reroll button rerendered");
            }
            return this;
        }
    });
    $.numbers.AcceptCombinationButton = Backbone.View.extend({
        tagName: 'div',
        className: 'acceptCombinationButton',
        events: {
            "click": "clicked"
        },
        clicked: function(){
            console.log("going to accept");
            var ind = this.options.parent.selectedIndex;
            //this.options.parent.model.acceptCombination(ind);
            $.numbers.app.doAccept(ind);
        },
        buttonTemplate: _.template("[accept]"),
        render: function(){
            this.$el.empty();
            this.$el.append(this.buttonTemplate());
            return this;
        }
    });
    $.numbers.StatusView = Backbone.View.extend({
        tagName: 'div',
        className: 'statusView',
        initialize: function(){
            this.listenTo(this.model, "change:status", this.listener);
        },
        listener: function(){
            this.render();
        },
        events: {
            "click": "clicked"
        },
        clicked: function(){
            console.log("model state:", this.model);
        },
        statusTemplate: _.template("status: <%= status%> "),
        meaningTemplate: _.template("(<%= value%>)"),
        render: function(){
            this.$el.empty();
            this.$el.append(this.statusTemplate(this.model.attributes));

            var value;

            if (this.model.attributes.status == 0) value = "connecting";
            else if (this.model.attributes.status == 10) value = "finding game";
            else if (this.model.attributes.status == 20) value = "rounds";
            else if (this.model.attributes.status == 90) value = "game is over";
            else if (this.model.attributes.status == -1) value = "game is abandoned";
            else value = "unknown status";

            this.$el.append(this.meaningTemplate({value: value}));

            return this;
        }
    });
    $.numbers.NamesView = Backbone.View.extend({
        tagName: 'div',
        className: 'namesView',
        initialize: function(){
            this.listenTo(this.model, "change:names", this.listener);
        },
        listener: function(){
            this.render();
        },
        events: {
            "click": "clicked"
        },
        clicked: function(e){
            // The reason why document.cookie is empty is httponly set as true
            /*
            var cookies = {};           // The object we will return
            var all = document.cookie;  // Get all cookies in one big string
            var list = all.split("; "); // Split into individual name=value pairs
            for(var i = 0; i < list.length; i++) {  // For each cookie
                var cookie = list[i];
                var p = cookie.indexOf("=");        // Find the first = sign
                var name = cookie.substring(0,p);   // Get cookie name
                var value = cookie.substring(p+1);  // Get cookie value
                value = decodeURIComponent(value);  // Decode the value
                cookies[name] = value;              // Store name and value in object
            }
            console.log("cookies", cookies);
            */
            console.log("names:", e.target.title, this.model.attributes.names, e);
            $.numbers.app.doViewAnotherModel(parseInt(e.target.title));
        },
        nameTemplate: _.template('<span title="<%= index %>"> <%= name %> </span>'),
        ownNameTemplate: _.template('<b><span title="<%= index %>"> <%= name %> </span></b>'),
        render: function(){
            this.$el.empty();
            if (this.model.attributes != null && this.model.attributes.names != null) {
                var ownIndex = this.model.getOwnPlayerIndex();
                for (var i = 0; i < this.model.attributes.names.length; i++){
                    if (i == ownIndex){
                        this.$el.append(this.ownNameTemplate({name: this.model.attributes.names[i], index: i}));
                    } else {
                        this.$el.append(this.nameTemplate({name: this.model.attributes.names[i], index: i}));
                    }
                }
            }
            return this;
        }
    });
    $.numbers.InputView = Backbone.View.extend({
        tagName: 'div',
        className: 'inputView',
        initialize: function(){
            //this.el.contentEditable = "true";
            //this.setValue(this.getName(this.options.parent.model));
            this.$el.attr('contentEditable',true);
            this.listenTo(this.options.parent.model, "change:names", this.listener);
        },
        listener: function(){
            this.setValue(this.getName(this.options.parent.model));
        },
        events: {
            // https://developer.mozilla.org/en-US/docs/Web/Events
            //"click": "clicked",
            //"keydown": "clicked",
            "input": "clicked"
        },
        clicked: function(event){
            console.log(this.getValue(), event, this.$el.clone());
        },
        getValue: function(){
            return this.$el[0].textContent;
        },
        setValue: function(value){
            this.$el[0].textContent = value;
        },
        getName: function(model){
            var id = model.attributes.sessionID;
            var ind = -1;
            for (var i = 0; i < model.attributes.players.length; i++){
                if (model.attributes.players[i] == id) {
                    ind = i;
                    break;
                }
            }
            return model.attributes.names[ind];
        },
        render: function(){
            this.$el.empty();
            this.$el.append("asdf");
            return this;
        }
    });

    $.numbers.ResultView = Backbone.View.extend({
        tagName: 'div',
        initialize: function(){
            this.$el.attr("class", "dice d"+this.model.value.toString() );
        },
        render: function() {
            this.$el.empty();
            return this;
        }
    });

    $.numbers.DiceView = Backbone.View.extend({
        tagName: 'div',
        initialize: function(){
            this.$el.attr("class", "dice d"+this.model.value.toString() );
            //this.$el.css("display", "inline-block");
        },
        events: {
            "click": "clicked"
        },
        clicked: function(){
            if (this.model.parent.model.attributes.clickable){
                if (this.model.parent.model.attributes.status != 20) {
                    console.log("wait while game starts");
                    return;
                }

                //console.log("click", this.model.value, event);
                this.model.selected = !this.model.selected;
                if (this.model.selected) this.select();
                else this.deselect();
                //$.numbers.app.combinationModel.attributes.currentSelected[this.model.index] = this.model.selected;
                $.numbers.app.doToggleDice(this.model.index, this.model.selected);
            } else {
                console.log("You can only observe game process of other player");
            }
        },
        select: function(){
            this.$el.addClass('selected');
        },
        deselect: function(){
            this.$el.removeClass('selected');
        },
        //diceTemplate:  _.template('<div class="dice<%= value %>"> <%= value %> </div>'),
        render: function() {
            this.$el.empty();
            //this.$el.append("<span>" + this.model.value + "</span>");
            //this.$el.append(this.diceTemplate(this.model));
            console.log('dice rendered');
            return this;
        }
    });
    $.numbers.CombinationView = Backbone.View.extend({
        tagName: 'div',
        className: 'combination',
        initialize: function(){
            this.selected = false;
            if (this.model.usedCombination) {
                this.$el.addClass("used");
            }
        },
        events: {
            "click": "clicked"
        },
        clicked: function(e){
            if (this.model.parent.model.attributes.clickable){
                if (this.model.parent.model.attributes.status != 20) {
                    console.log("wait while game starts");
                    return;
                }

                if (this.model.usedCombination == false) {
                    //console.log("click", this.model.name, this.model.value, event);
                    this.selected = !this.selected;

                    if (this.selected) {
                        this.model.parent.deselectAllCombinations();
                        //this.select();
                        this.model.parent.selectCombination(this.model.index, this);
                    }
                    else {
                        //this.deselect();
                        this.model.parent.deselectCombination(this.model.index, this);
                    }

                    console.log("quick click with ctrl");
                    var ind = this.model.index;
                    $.numbers.app.doAccept(ind);
                    //console.log("quick click");
                    //var ind = this.model.index;
                    //$.numbers.app.doAccept(ind);
                }
            } else {
                console.log("You can only observe game process of other player");
            }
        },
        select: function(){
            this.selected = true;
            this.$el.addClass('selected');
        },
        deselect: function(){
            this.selected = false;
            this.$el.removeClass('selected');
        },
        combinationTemplate:  _.template('<%= name %>: <%= value %>'),
        render: function() {
            this.$el.empty();
            this.$el.append(this.combinationTemplate(this.model));
            console.log('combination rendered');
            return this;
        }
    });
    $.numbers.CombinationsView = Backbone.View.extend({
        tagName: 'div',
        className: 'combinations',
        initialize: function(){
            this.selectedIndex = -1;
            this.listenTo(this.model, "change:combinations", this.combinationsChanged);
        },
        combinationsChanged: function(mdl,xhr){
            console.log("listener is here", mdl, xhr);
            this.render();
        },

        selectCombination: function(index, element){
            this.selectedIndex = index;
            //$(element).addClass("selected");
            element.select();
        },
        deselectCombination: function(index, element){
            this.selectedIndex = -1;
            //$(element).removeClass("selected");
            element.deselect();
        },
        deselectAllCombinations: function(){
            for (var i = 0; i < this.combinationsViews.length; i++) {
                this.deselectCombination(i, this.combinationsViews[i]);
            }
        },
        getScreenSize: function() {
            var winW = 555, winH = 333;
            if (document.body && document.body.offsetWidth) {
                winW = document.body.offsetWidth;
                winH = document.body.offsetHeight;
            }
            if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth ) {
                winW = document.documentElement.offsetWidth;
                winH = document.documentElement.offsetHeight;
            }
            if (window.innerWidth && window.innerHeight) {
                winW = window.innerWidth;
                winH = window.innerHeight;
            }
            return {width: winW, height: winH};
        },

        dicesHolderTemplate:  _.template('<div class="dicesHolder"></div>'),
        renderDices: function(element){
            for (var i = 0; i < this.model.attributes.dices.length; i++) {
                var dice = new $.numbers.DiceView({model: {
                    index: i,
                    value: this.model.attributes.dices[i],
                    selected: false,
                    parent: this
                }});
                element.append(dice.render().el);
            }
        },
        renderResults: function(element){
            var str = this.model.calculate().toString();
            for (var i = 0; i < str.length; i++) {
                var num = parseInt(str[i]);
                element.append( (new $.numbers.ResultView({model: {value: num}})).render().el);
            }
        },
        renderCombinations: function(element){
            var names = ["1er", "2er", "3er", "4er", "5er", "6er", "Dreir Pasch",
                "Vierer Pasch", "Full House", "Kleine Straße", "Große Straße", "Yazzee", "Chance"];
            this.combinationsViews = [];
            var usedCombinations = this.model.getUsedCombinations();

            var $table = $('<table/>');

            var tableAdapter = {};
            tableAdapter[0] = 0;
            tableAdapter[1] = 2;
            tableAdapter[2] = 4;
            tableAdapter[3] = 6;
            tableAdapter[4] = 8;
            tableAdapter[5] = 10;
            tableAdapter[6] = 1;
            tableAdapter[7] = 3;
            tableAdapter[8] = 5;
            tableAdapter[9] = 7;
            tableAdapter[10] = 9;
            tableAdapter[11] = 11;
            tableAdapter[12] = 13;

            var combosElements = [];

            for (var i = 0; i < this.model.attributes.combinations.length; i++){

                var used = false;
                for (var j = 0; j < usedCombinations.length; j++) {
                    if (i == usedCombinations[j]) {
                        used = true;
                        break;
                    }
                }

                var mdl = {
                    index: i,
                    name: names[i],
                    value: this.model.attributes.combinations[i],
                    usedCombination: used,
                    parent: this
                };
                if (used) mdl.value = this.model.getCombinationByIndex(i).points;

                var combo = new $.numbers.CombinationView({model: mdl});
                //element.append( combo.render().el );
                combosElements.push(combo.render().el);

                this.combinationsViews.push(combo);
            }

            var screenSize = this.getScreenSize();
            var firstColumnHeight = 50; // percent
            if (screenSize.width < 350) firstColumnHeight = 40;
            for (var k = 0; k < 7; k++){
                var $tr = $('<tr/>');
                var $td1 = $('<td style="width: ' + (  firstColumnHeight  ) +'%; padding: 0;"></td>');
                var $td2 = $('<td style="width: ' + (100-firstColumnHeight) +'%; padding: 0;"></td>');
                if (k!=6) $td1.append(combosElements[0 + k]);
                $td2.append(combosElements[6 + k]);
                $tr.append($td1);
                $tr.append($td2);
                $table.append($tr);
            }
            element.append($table);

        },
        render: function() {
            this.$el.empty();
            //this.$el.append(this.combinationsTemplate(this.model.attributes));
            this.$el.append(this.dicesHolderTemplate());
            var dicesHolder = this.$el.find(".dicesHolder");
            console.log("dicesHolder", dicesHolder);

            if (this.model.getUsedCombinations().length == 13){
                this.renderResults(dicesHolder);
            } else {
                this.renderDices(dicesHolder);
            }

            this.renderCombinations(this.$el);
            console.log('combinations rendered');
            return this;
        }
    });

    $.numbers.GameObserve = Backbone.View.extend({
        tagName: 'div',
        className: 'game',
        initialize: function(){
            this.previousDisplay = this.$el.css("display");
            this.$el.css("display", "none");

            this.listenTo(this.model, 'change:clickable', this.listener);
            this.listenTo(this.model, 'change:observerIndex', this.render);
            this.listenTo(this.model, 'change:rounds', this.render);
        },
        listener: function(){
            if (!this.model.attributes.clickable) {
                this.$el.css("display", this.previousDisplay);
            } else {
                this.previousDisplay = this.$el.css("display");
                this.$el.css("display", "none");
            }
        },
        events: {
            "click": "click"
        },
        click: function(){
            //var ind = this.model.getOwnPlayerIndex();
            //this.model.viewAnotherModel(ind);
        },
        renderDices: function(element, dices){
            for (var i = 0; i < dices.length; i++) {
                var dice = new $.numbers.DiceView({model: {
                    index: i,
                    value: dices[i],
                    selected: false,
                    parent: this
                }});
                element.append(dice.render().el);
            }
        },
        renderResults: function(element){
            var playerIndex = this.model.attributes.observerIndex;
            var str = this.model.calculatePlayer(playerIndex).toString();
            for (var i = 0; i < str.length; i++) {
                var num = parseInt(str[i]);
                element.append( (new $.numbers.ResultView({model: {value: num}})).render().el);
            }
        },
        renderCombinations: function(element, combinations){
            var names = ["1er", "2er", "3er", "4er", "5er", "6er", "Dreir Pasch",
                "Vierer Pasch", "Full House", "Kleine Straße", "Große Straße", "Yazzee", "Chance"];
            this.combinationsViews = [];
            var playerIndex = this.model.attributes.observerIndex;
            var usedCombinations = this.model.getUsedCombinationsMemory(playerIndex);

            var $table = $('<table/>');

            var tableAdapter = {};
            tableAdapter[0] = 0;
            tableAdapter[1] = 2;
            tableAdapter[2] = 4;
            tableAdapter[3] = 6;
            tableAdapter[4] = 8;
            tableAdapter[5] = 10;
            tableAdapter[6] = 1;
            tableAdapter[7] = 3;
            tableAdapter[8] = 5;
            tableAdapter[9] = 7;
            tableAdapter[10] = 9;
            tableAdapter[11] = 11;
            tableAdapter[12] = 13;

            var combosElements = [];

            for (var i = 0; i < combinations.length; i++){

                var used = false;
                for (var j = 0; j < usedCombinations.length; j++) {
                    if (i == usedCombinations[j]) {
                        used = true;
                        break;
                    }
                }

                var mdl = {
                    index: i,
                    name: names[i],
                    value: combinations[i],
                    usedCombination: used,
                    parent: this
                };
                if (used) mdl.value = this.model.getCombinationByIndexMemory(playerIndex, i).points;

                var combo = new $.numbers.CombinationView({model: mdl});
                //element.append( combo.render().el );
                combosElements.push(combo.render().el);

                this.combinationsViews.push(combo);
            }

            for (var k = 0; k < 7; k++){
                var $tr = $('<tr/>');
                var $td1 = $('<td style="width: 50%; padding: 0;"></td>');
                var $td2 = $('<td style="width: 50%; padding: 0;"></td>');
                if (k!=6) $td1.append(combosElements[0 + k]);
                $td2.append(combosElements[6 + k]);
                $tr.append($td1);
                $tr.append($td2);
                $table.append($tr);
            }
            element.append($table);
        },
        render: function(){
            this.$el.empty();
            //var comboView = new $.numbers.CombinationsView({model: $.numbers.app.combinationModel});
            //$.numbers.app.combinationsView = comboView;

            var playerIndex = this.model.attributes.observerIndex;
            if (playerIndex != -1){
                if (this.model.attributes.rounds == null || this.model.attributes.rounds[playerIndex] == null){
                    console.warn("undefined is here");
                    return this;
                }
                var rlen = this.model.attributes.rounds[playerIndex].length;
                var dices = this.model.attributes.rounds[playerIndex][rlen - 1].dices;

                var usedCombinations = this.model.getUsedCombinationsMemory(playerIndex);
                if (usedCombinations.length == 13){
                    this.renderResults(this.$el);
                } else {
                    var $dicesHolder = $('<div />', {
                        "class": 'dicesHolder'
                    });
                    this.$el.append($dicesHolder);
                    this.renderDices($dicesHolder, dices);
                }

                var combinations = checkCombinations(dices);
                this.renderCombinations(this.$el, combinations);
            }

            return this;
        }
    });
    $.numbers.GameView = Backbone.View.extend({
        tagName: 'div',
        className: 'game',
        initialize: function(){
            //this.model = new $.numbers.Game();
            this.listenTo($.numbers.app.combinationModel, 'change:clickable', this.listener);
        },
        listener: function(){
            //console.warn("doasdjiaojsdioajsdfipojasdf");
            var mdl = $.numbers.app.combinationModel;
            if (mdl.attributes.clickable) {
                this.$el.css("display", this.previousDisplay);
            } else {
                this.previousDisplay = this.$el.css("display");
                this.$el.css("display", "none");
            }
        },
        render: function(){
            var self = this;
            this.$el.empty();
            //$.numbers.app.currentCombination = new $.numbers.Combination();
            var comboView = new $.numbers.CombinationsView({model: $.numbers.app.combinationModel});
            $.numbers.app.combinationsView = comboView;

            var rerollButton = new $.numbers.RerollButton({model: $.numbers.app.combinationModel, parent: $.numbers.app.combinationsView});
            //this.$el.append(rerollButton.render().el);
            var restartButton = new $.numbers.RestartButton({parent: $.numbers.app.combinationsView});
            //this.$el.append(restartButton.render().el);

            var $table = $('<table/>');
            var $tr = $('<tr/>');
            var $td1 = $('<td style="width: 50%; padding: 0;"></td>');
            var $td2 = $('<td style="width: 50%; padding: 0;"></td>');
            $td1.append(rerollButton.render().el);
            $td2.append(restartButton.render().el);
            $tr.append($td1);
            $tr.append($td2);
            $table.append($tr);
            this.$el.append($table);

            var numbers = self.$el; //$('#combinations');
            numbers.append(comboView.render().el);

            //var acceptCombinationButton = new $.numbers.AcceptCombinationButton({parent: $.numbers.app.combinationsView});
            //this.$el.append(acceptCombinationButton.render().el);

            //var inputView = new $.numbers.InputView({parent: $.numbers.app.combinationsView});
            //this.$el.append(inputView.render().el);

            console.log('gameView rendered');
            return this;
        }
    });
    $.numbers.DebugView = Backbone.View.extend({
        tagName: 'div',
        initialize: function(){
            this.listenTo(this.model, 'change', this.render);
        },
        render: function(){
            var self = this;
            this.$el.empty();
            var pre = _.extend({}, this.model.attributes);
            pre.rounds = {};
            this.$el.append(JSON.stringify(pre));

            return this;
        }
    });

    // Router

    // looks like main application class
    $.numbers.Router = Backbone.Router.extend({
        routes: {
            "play": "numbers"
        },
        initialize: function(){
            console.log("1. app init");
        },
        numbers: function(){
            console.log("2. app route");

            var self = this;
            var $body = $('body');

            //this.getConnection(function(){
                $.numbers.networking = true;
                console.log("networking(junked):", $.numbers.networking);
                self.combinationModel = new $.numbers.Combination();

                var nameView = new $.numbers.NamesView({model: self.combinationModel});
                $body.append(nameView.render().el);

                var statusView = new $.numbers.StatusView({model: self.combinationModel});
                $body.append(statusView.render().el);

                self.gameModel = new $.numbers.Game();
                self.gameView = new $.numbers.GameView({model: self.gameModel});
                self.gameView.render();

                $body.append(self.gameView.el);

                //self.debugView = new $.numbers.DebugView({model: self.combinationModel});
                //$body.append(self.debugView.el);

                self.gameObserver = new $.numbers.GameObserve({model: self.combinationModel});
                $body.append(self.gameObserver.render().el);
            //});
        },
        /*getConnection: function(callback){
            this.connection = new $.numbers.ModelConnection(function(){
                callback();
            });
        },*/

        doAccept: function(index){
            this.combinationModel.acceptCombination(index);
        },
        doReroll: function(){
            this.combinationModel.rerollDices();
        },
        doToggleDice: function(index, value){
            this.combinationModel.toggleDice(index, value);
        },
        doRestart: function(){
            this.combinationModel.restart();
        },
        doViewAnotherModel: function(index){
            this.combinationModel.viewAnotherModel(index);
        }
    });

    // App

    $.numbers.app = null;

    $.numbers.bootstrap = function(){
        $.numbers.app = new $.numbers.Router();
        Backbone.history.start({pushState: true});
    };
})(jQuery);