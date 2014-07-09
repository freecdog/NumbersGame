/**
 * Created by yarvyk on 07.07.14.
 */

(function($) {

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

    $.numbers = {};

    //$.numbers.networking = true;
    //console.log("Networking", $.numbers.networking ? "enabled" : "disabled");

    // Models

    // status difinition in rules
    $.numbers.Game = Backbone.Model.extend( {
        urlRoot: '/api/connectPlayer',
        idAttribute: '_id',
        defaults: {
            '_id':  null,
            'status': 0,
            combinations: null
        },
        initialize: function() {
            if ($.numbers.networking == false) {
                this._id = -1;
                this.urlRoot = "";
                this.status = 20;    // status 10 become useless because without networking
            }
            else {
                //console.error("we need some code here");
            }

            this.listenTo(this, 'change', this.statusChanged);

            this.updateModel();
        },
        statusChanged: function(){
            var needUpdate = true;
            if (this.status == 0) {
                this.urlRoot = '/api/connectPlayer';
            } else if (this.status == 10) {
                this.urlRoot = '/api/findGame';
            } else {
                needUpdate = false;
                console.warn("unknown game status:",this.status);
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
        }

    });

    $.numbers.Combination = Backbone.Model.extend({
        urlRoot: '/api/dices',
        idAttribute: '_id',
        defaults: {
            '_id':  null,
            dices: [0, 0, 0, 0, 0, 0],
            combinations: []
        },

        initialize: function(callback) {
            if (callback == null) callback = function(){};
            var self = this;

            // localStorage - sync values among all tabs
            // sessionStorage - keep values only in one tab
            this.storage = localStorage; //document.cookie; //localStorage; //sessionStorage;

            if (this.existValue("lastDices")){
                //this.attributes.dices = JSON.parse( this.getValue("lastDices") );
                self.set({dices: JSON.parse( self.getValue("lastDices") )});
                //this.attributes.combinations = checkCombinations(this.attributes.dices);
                self.set({combinations: checkCombinations(self.attributes.dices)});
                callback();
            } else {
                /*this.getDices(function(dices){
                    self.addValue("lastDices", JSON.stringify(dices));
                    //self.attributes.dices = dices;
                    self.set({dices: dices});
                    //self.attributes.combinations = checkCombinations(self.attributes.dices);
                    self.set({combinations: checkCombinations(self.attributes.dices)});
                    callback();
                });*/
                this.generateCombination(callback);
            }

            /*if ($.numbers.networking == false) {
                this.urlRoot = "";
                if (typeof storedDices == 'undefined') {
                    this.attributes.dices = this.getCombination(function(){});
                    $.numbers.app.addValue("lastDices", JSON.stringify(this.attributes.dices));
                } else {
                    this.attributes.dices = storedDices;
                }
                this.attributes.combinations = checkCombinations(this.attributes.dices);
            } else {
                //console.error("we need some code here");
                if (typeof storedDices == 'undefined') {
                    var self = this;
                    this.getCombination(function(newDices){
                        self.attributes.dices = newDices;
                        $.numbers.app.addValue("lastDices", JSON.stringify(self.attributes.dices));
                        self.attributes.combinations = checkCombinations(self.attributes.dices);
                        callback();
                    });
                } else {
                    this.attributes.dices = storedDices;
                    this.attributes.combinations = checkCombinations(this.attributes.dices);
                    callback();
                }
            }*/

        },

        getDices: function(callback) {
            if (callback == null) callback = function(){};
            var ans = [0, 0, 0, 0, 0, 0];
            if ($.numbers.networking == false) {
                for (var i = 0; i < 6; i++) ans[i] = generateDice();
            } else {
                this.fetch({
                    success: function(mdl, directValues){
                        ans = directValues;
                        callback(ans);
                    },
                    error: function(mdl, values){
                        console.log("some error",mdl, values);
                        callback();
                    }
                });
                //console.error("we need some code here");
            }
            return ans;
        },

        reroll: function(callback, indexes){
            if (callback == null) callback = function(){};
            var self = this;
            if ($.numbers.networking == false) {
                //console.log("before", this.attributes.dices);
                for (var i = 0; i < indexes.length; i++) {
                    this.attributes.dices[ indexes[i] ] = generateDice();
                    $.numbers.app.currentSelected[ indexes[i] ] = false;
                }
                self.set({dices: self.attributes.dices});
                //this.attributes.combinations = checkCombinations(this.attributes.dices);
                self.set({combinations: checkCombinations(self.attributes.dices)});
                //console.log("after", this.attributes.dices);
            } else {
                //console.error("we need some code here");
                var prevUrlRoot = this.urlRoot;

                this.urlRoot += "/";
                for (var i = 0; i < indexes.length; i++){
                    this.urlRoot += indexes[i].toString();
                }
                console.log("going to fetch rerolled dices", this.urlRoot);
                this.fetch({
                    success: function(mdl, values){
                        console.log("successfully rerolled dices", values);
                        for (var i = 0; i < indexes.length; i++) {
                            self.attributes.dices[ indexes[i] ] = parseInt(values[i]);
                            $.numbers.app.currentSelected[ indexes[i] ] = false;
                        }
                        self.set({dices: self.attributes.dices});
                        //self.attributes.combinations = checkCombinations(self.attributes.dices);
                        self.set({combinations: checkCombinations(self.attributes.dices)});
                        console.log("rerolled dices", self.attributes.dices);
                        self.urlRoot = prevUrlRoot;
                        callback();
                    },
                    error: function(mdl, values){
                        self.urlRoot = prevUrlRoot;
                        callback();
                    }
                });
            }
        },
        // reroll all checked dices, rerollMode
        rerollDices: function(){
            if ($.numbers.networking == false) {
                if ($.numbers.app.currentRerollStatus == false) {
                    var indexes = [];
                    for (var i = 0; i < $.numbers.app.currentSelected.length; i++) {
                        if ($.numbers.app.currentSelected[i] == true) indexes.push(i);
                    }
                    if (indexes.length > 0) {
                        $.numbers.app.currentRerollStatus = true;
                        this.reroll( null, indexes );
                        //$.numbers.app.combinationsView.render();
                    }
                } else {
                    console.log("already rerolled");
                }
            } else {
                if ($.numbers.app.currentRerollStatus == false) {
                    var indexes = [];
                    for (var i = 0; i < $.numbers.app.currentSelected.length; i++) {
                        if ($.numbers.app.currentSelected[i] == true) indexes.push(i);
                    }
                    if (indexes.length > 0) {
                        $.numbers.app.currentRerollStatus = true;
                        this.reroll( function(){
                            //$.numbers.app.combinationsView.render();
                        }, indexes );
                    }
                } else {
                    console.log("already rerolled");
                }
            }
        },

        acceptCombination: function(index){
            var selectedIndex = index;
            if (selectedIndex != -1) {
                var combo = {};
                combo.dices = this.attributes.dices;
                combo.combinationIndex = selectedIndex;
                combo.points = this.attributes.combinations[selectedIndex];

                if (this.checkCombination(selectedIndex)) {
                    this.addCombination(combo);
                    this.removeValue("lastDices");
                    console.log("combo added", combo);

                    $.numbers.app.currentRerollStatus = false;

                    // generating new combination
                    this.generateCombination();

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
        generateCombination: function(callback){
            if (callback == null) callback = function(){};
            var self = this;
            self.getDices(function(dices){
                self.addValue("lastDices", JSON.stringify(dices));
                self.set({dices: dices});
                self.set({combinations: checkCombinations(self.attributes.dices)});
                callback();
            });
        },
        checkCombination: function(index){
            var available = true;
            var usedCombos = this.getCombinations();
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
            } else {
                combos.push(combo);
            }
            this.addValue("combinations", JSON.stringify(combos));
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
        getCombinations: function(){
            var combosIndexes = [];
            if (this.existValue("combinations")){
                var combos = JSON.parse( this.getValue("combinations") );
                for (var i = 0; i < combos.length; i++){
                    combosIndexes.push(combos[i].combinationIndex);
                }
            }
            return combosIndexes;
        },

        restart: function(){
            this.removeValue("combinations");
            this.removeValue("lastDices");
            //this.gameView.render();
            console.warn("not sure if this work");
            this.initialize();
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
            var self = this;
            this.fetch({
                success: function(mdl, values){
                    $.numbers.networking = true;
                    console.log("connection fetched", mdl, values);
                    callback();
                },
                error: function(mdl, values){
                    $.numbers.networking = false;
                    console.log("Can't connect to server", mdl, values);
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
            $.numbers.app.restart();
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
        clicked: function(){
            console.log("going to reroll", this.options.parent);
            //$.numbers.app.rerollDices();
            this.options.parent.model.rerollDices();
        },
        buttonTemplate: _.template("[reroll]"),
        render: function() {
            this.$el.empty();
            this.$el.append(this.buttonTemplate());
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
            this.options.parent.model.acceptCombination(ind);
            //$.numbers.app.acceptCombination(ind);
        },
        buttonTemplate: _.template("[accept combination]"),
        render: function(){
            this.$el.empty();
            this.$el.append(this.buttonTemplate());
            return this;
        }
    });

    $.numbers.ResultView = Backbone.View.extend({
        tagName: 'div',
        initialize: function(){
            this.$el.attr("class", "dice"+this.model.value.toString() );
        },
        render: function() {
            this.$el.empty();
            return this;
        }
    });

    $.numbers.DiceView = Backbone.View.extend({
        tagName: 'div',
        initialize: function(){
            this.$el.attr("class", "dice"+this.model.value.toString() );
        },
        events: {
            "click": "clicked"
        },
        clicked: function(){
            //console.log("click", this.model.value, event);
            this.model.selected = !this.model.selected;
            $.numbers.app.currentSelected[this.model.index] = this.model.selected;
            if (this.model.selected) this.select();
            else this.deselect();
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
        clicked: function(){
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
        events: {
        },
        initialize: function(){
            this.selectedIndex = -1;
            this.listenTo(this.model, "change:combinations", this.listener);
        },
        listener: function(mdl,xhr){
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
        /*acceptCombination: function(){
            if (this.selectedIndex != -1) {
                var combo = {};
                combo.dices = this.model.attributes.dices;
                combo.combinationIndex = this.selectedIndex;
                combo.points = this.model.attributes.combinations[this.selectedIndex];

                if ($.numbers.app.checkCombination(this.selectedIndex)) {
                    $.numbers.app.addCombination(combo);
                    $.numbers.app.removeValue("lastDices");
                    console.log("combo added", combo);
                    return true;
                } else {
                    console.log("can't add combo");
                    return false;
                }
            } else {
                console.log("nothing was taked");
                return false;
            }
        },*/
        dicesHolderTemplate:  _.template('<div id="dicesHolder"></div>'),
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
            var str = $.numbers.app.calculate().toString();
            for (var i = 0; i < str.length; i++) {
                var num = parseInt(str[i]);
                element.append( (new $.numbers.ResultView({model: {value: num}})).render().el);
            }
        },
        renderCombinations: function(element){
            var names = ["1er", "2er", "3er", "4er", "5er", "6er", "Dreir Pasch",
                "Vierer Pasch", "Full House", "Kleine Straße", "Große Straße", "Yazzee", "Chance"];
            this.combinationsViews = [];
            //var usedCombinations = $.numbers.app.getCombinations();
            var usedCombinations = this.model.getCombinations();

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
                //if (used) mdl.value = $.numbers.app.getCombinationByIndex(i).points;
                if (used) mdl.value = this.model.getCombinationByIndex(i).points;

                var combo = new $.numbers.CombinationView({model: mdl});
                //element.append( combo.render().el );
                combosElements.push(combo.render().el);

                this.combinationsViews.push(combo);
            }

            for (var i = 0; i < 7; i++){
                var $tr = $('<tr/>');
                var $td1 = $('<td width="50%" style="padding: 0px"/>');
                var $td2 = $('<td width="50%" style="padding: 0px"/>');
                if (i!=6) $td1.append(combosElements[0 + i]);
                $td2.append(combosElements[6 + i]);
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
            var dicesHolder = this.$el.find("#dicesHolder");

            //if ($.numbers.app.getCombinations().length == 13){
            if (this.model.getCombinations().length == 13){
                this.renderResults(dicesHolder);
            } else {
                this.renderDices(dicesHolder);
            }

            this.renderCombinations(this.$el);
            console.log('combinations rendered');
            return this;
        }
    });

    $.numbers.GameView = Backbone.View.extend({
        tagName: 'div',
        className: 'game',
        initialize: function(){
            this.model = new $.numbers.Game();
        },
        render: function(callback){
            if (callback == null) callback = function(){};
            if ($.numbers.networking == false) {
                var self = this;
                this.$el.empty();

                $.numbers.app.currentRerollStatus = false;
                $.numbers.app.currentSelected = [false, false, false, false, false, false];
                $.numbers.app.currentCombination = new $.numbers.Combination();
                var comboView = new $.numbers.CombinationsView({model: $.numbers.app.currentCombination});
                $.numbers.app.combinationsView = comboView;

                var rerollButton = new $.numbers.RerollButton({parent: $.numbers.app.combinationsView});
                //this.$el.append(rerollButton.render().el);
                var restartButton = new $.numbers.RestartButton();
                //this.$el.append(restartButton.render().el);

                var $table = $('<table/>');
                var $tr = $('<tr/>');
                var $td1 = $('<td width="50%" style="padding: 0px"/>');
                var $td2 = $('<td width="50%" style="padding: 0px"/>');
                $td1.append(rerollButton.render().el);
                $td2.append(restartButton.render().el);
                $tr.append($td1);
                $tr.append($td2);
                $table.append($tr);
                this.$el.append($table);

                var numbers = this.$el; //$('#combinations');
                numbers.append(comboView.render().el);

                var acceptCombinationButton = new $.numbers.AcceptCombinationButton({parent: $.numbers.app.combinationsView});
                this.$el.append(acceptCombinationButton.render().el);

                console.log('gameView rendered');
                callback();
                return this;
            } else {
                var self = this;
                this.$el.empty();

                $.numbers.app.currentRerollStatus = false;
                $.numbers.app.currentSelected = [false, false, false, false, false, false];
                //if ($.numbers.app.existValue("lastDices")){
                //var storedDices = JSON.parse( $.numbers.app.getValue("lastDices") );
                $.numbers.app.currentCombination = new $.numbers.Combination();
                var comboView = new $.numbers.CombinationsView({model: $.numbers.app.currentCombination});
                $.numbers.app.combinationsView = comboView;

                var rerollButton = new $.numbers.RerollButton({parent: $.numbers.app.combinationsView});
                //this.$el.append(rerollButton.render().el);
                var restartButton = new $.numbers.RestartButton();
                //this.$el.append(restartButton.render().el);

                var $table = $('<table/>');
                var $tr = $('<tr/>');
                var $td1 = $('<td width="50%" style="padding: 0px"/>');
                var $td2 = $('<td width="50%" style="padding: 0px"/>');
                $td1.append(rerollButton.render().el);
                $td2.append(restartButton.render().el);
                $tr.append($td1);
                $tr.append($td2);
                $table.append($tr);
                this.$el.append($table);

                var numbers = self.$el; //$('#combinations');
                numbers.append(comboView.render().el);

                var acceptCombinationButton = new $.numbers.AcceptCombinationButton({parent: $.numbers.app.combinationsView});
                self.$el.append(acceptCombinationButton.render().el);

                console.log('gameView rendered');
                callback();
                return self;
                /*} else {
                    $.numbers.app.currentCombination = new $.numbers.Combination(function(){
                        var comboView = new $.numbers.CombinationsView({model: $.numbers.app.currentCombination});
                        $.numbers.app.combinationsView = comboView;
                        var numbers = self.$el; //$('#combinations');
                        numbers.append(comboView.render().el);

                        var acceptCombinationButton = new $.numbers.AcceptCombinationButton({parent: $.numbers.app.combinationsView});
                        self.$el.append(acceptCombinationButton.render().el);

                        console.log('gameView rendered');
                        callback();
                        //return self;
                    });
                }*/

            }

        }
    });

    // Router

    // looks like main application class
    $.numbers.Router = Backbone.Router.extend({
        routes: {
            "play": "numbers"
        },

        initialize: function(){

            // localStorage - sync values among all tabs
            // sessionStorage - keep values only in one tab
            this.storage = localStorage; //document.cookie; //localStorage; //sessionStorage;

            console.log("1. app init");
        },
        numbers: function(){
            console.log("2. app route");

            var self = this;

            this.getConnection(function(){
                console.log("networking:", $.numbers.networking);
                self.gameView = new $.numbers.GameView();
                self.gameView.render(function(){
                    $('body').append(self.gameView.el);
                });
            });
        },

        getConnection: function(callback){
            this.connection = new $.numbers.ModelConnection(function(){
                callback();
            });
        },

        /*addCombination: function(combo){
            var combos = [];
            if (this.existValue("combinations")){
                combos = JSON.parse( this.getValue("combinations") );
                combos.push(combo);
            } else {
                combos.push(combo);
            }
            this.addValue("combinations", JSON.stringify(combos));
        },*/
        /*getCombinationByIndex: function(index){
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
        },*/
        /*getCombinations: function(){
            var combosIndexes = [];
            if (this.existValue("combinations")){
                var combos = JSON.parse( this.getValue("combinations") );
                for (var i = 0; i < combos.length; i++){
                    combosIndexes.push(combos[i].combinationIndex);
                }
            }
            return combosIndexes;
        },
        checkCombination: function(index){
            var available = true;
            var usedCombos = this.getCombinations();
            if (usedCombos.length != 0){
                for (var i = 0; i < usedCombos.length; i++){
                    if (usedCombos[i] == index){
                        available = false;
                        break;
                    }
                }
            }
            return available;
        },*/

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

        /*acceptCombination: function(index){
            //if ($.numbers.app.combinationsView.acceptCombination()) {
            //    this.gameView.render();
            //}
            if (this.currentCombination.acceptCombination(index)) {
                //this.gameView.render();
            }
        },*/
        // reroll all checked dices, rerollMode
        /*rerollDices: function(){
            if ($.numbers.networking == false) {
                if ($.numbers.app.currentRerollStatus == false) {
                    var indexes = [];
                    for (var i = 0; i < $.numbers.app.currentSelected.length; i++) {
                        if ($.numbers.app.currentSelected[i] == true) indexes.push(i);
                    }
                    if (indexes.length > 0) {
                        $.numbers.app.currentRerollStatus = true;
                        $.numbers.app.currentCombination.reroll( null, indexes );
                        $.numbers.app.combinationsView.render();
                    }
                } else {
                    console.log("already rerolled");
                }
            } else {
                if ($.numbers.app.currentRerollStatus == false) {
                    var indexes = [];
                    for (var i = 0; i < $.numbers.app.currentSelected.length; i++) {
                        if ($.numbers.app.currentSelected[i] == true) indexes.push(i);
                    }
                    if (indexes.length > 0) {
                        $.numbers.app.currentRerollStatus = true;
                        $.numbers.app.currentCombination.reroll( function(){
                            $.numbers.app.combinationsView.render();
                        }, indexes );
                    }
                } else {
                    console.log("already rerolled");
                }
            }
        },*/
        restart: function(){
            this.removeValue("combinations");
            this.removeValue("lastDices");
            this.gameView.render();
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

    // App

    $.numbers.app = null;

    $.numbers.bootstrap = function(){
        $.numbers.app = new $.numbers.Router();
        Backbone.history.start({pushState: true});
    };
})(jQuery);