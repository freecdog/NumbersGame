/**
 * Created by jaric on 24.06.14.
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

    $.numbers.networking = false;
    console.log("Networking", $.numbers.networking ? "enabled" : "disabled");

    // Models

    // status difinition in rules
    $.numbers.Game = Backbone.Model.extend({
        urlRoot: '/api/game',
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

        initialize: function(storedDices) {
            if ($.numbers.networking == false) {
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
                    });
                } else {
                    this.attributes.dices = storedDices;
                    this.attributes.combinations = checkCombinations(this.attributes.dices);
                }
            }

        },

        getCombination: function(callback) {
            var ans = [0, 0, 0, 0, 0, 0];
            if ($.numbers.networking == false) {
                for (var i = 0; i < 6; i++) ans[i] = generateDice();
            } else {
                this.fetch({success: function(mdl, directValues){
                    ans = directValues;
                    callback(ans);
                }});
                //console.error("we need some code here");
            }
            return ans;
        },

        reroll: function(indexes){
            //console.log("before", this.attributes.dices);
            if ($.numbers.networking == false) {
                for (var i = 0; i < indexes.length; i++) {
                    this.attributes.dices[ indexes[i] ] = generateDice();
                    $.numbers.app.currentSelected[ indexes[i] ] = false;
                }
            } else {
                console.error("we need some code here");
            }
            this.attributes.combinations = checkCombinations(this.attributes.dices);
            //console.log("after", this.attributes.dices);
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
            console.log("going to reroll");
            $.numbers.app.rerollDices();
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
            $.numbers.app.acceptCombination();
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
            //"click": function(event){this.clicked(event);}
        },
        initialize: function(){
            this.selectedIndex = -1;
            //$.numbers.app.addValue("CombinationsView", Math.random() * 100);
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
        acceptCombination: function(){
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
        },
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
            var usedCombinations = $.numbers.app.getCombinations();
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
                if (used) mdl.value = $.numbers.app.getCombination(i).points;

                var combo =  new $.numbers.CombinationView({model: mdl});
                element.append( combo.render().el );

                this.combinationsViews.push(combo);
            }
        },
        render: function() {
            this.$el.empty();
            //this.$el.append(this.combinationsTemplate(this.model.attributes));
            this.$el.append(this.dicesHolderTemplate());
            var dicesHolder = this.$el.find("#dicesHolder");

            if ($.numbers.app.getCombinations().length == 13){
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
        render: function(){
            this.$el.empty();

            var restartButton = new $.numbers.RestartButton();
            this.$el.append(restartButton.render().el);
            var rerollButton = new $.numbers.RerollButton();
            this.$el.append(rerollButton.render().el);

            $.numbers.app.currentRerollStatus = false;
            $.numbers.app.currentSelected = [false, false, false, false, false, false];
            if ($.numbers.app.existValue("lastDices")){
                var storedDices = JSON.parse( $.numbers.app.getValue("lastDices") );
                $.numbers.app.currentCombination = new $.numbers.Combination(storedDices);
            } else {
                $.numbers.app.currentCombination = new $.numbers.Combination();
            }
            var comboView = new $.numbers.CombinationsView({model: $.numbers.app.currentCombination});
            $.numbers.app.combinationsView = comboView;
            var numbers = this.$el; //$('#combinations');
            numbers.append(comboView.render().el);

            var acceptCombinationButton = new $.numbers.AcceptCombinationButton();
            this.$el.append(acceptCombinationButton.render().el);

            console.log('gameView rendered');
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
            // localStorage - sync values among all tabs
            // sessionStorage - keep values only in one tab
            this.storage = localStorage; //document.cookie; //localStorage; //sessionStorage;

            console.log("app init");
        },
        numbers: function(){
            //var combinationString = generateDice().toString() + generateDice().toString() +
            // generateDice().toString() + generateDice().toString() +
            // generateDice().toString() + generateDice().toString();
            //console.log("Test. we are here", combinationString);
            //console.log(checkCombinations(combinationString));

            this.gameView = new $.numbers.GameView();
            $('body').append(this.gameView.render().el);
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
            /* end game case
            if (combos.length == 13) {
                console.log("going to calculate results");
                var totalPts = this.calculate();
                $.numbers.app.combinationsView.render(totalPts);
            }*/
        },
        getCombination: function(index){
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

        acceptCombination: function(){
            if ($.numbers.app.combinationsView.acceptCombination()) {
                this.gameView.render();
            }
        },
        // reroll all checked dices, rerollMode
        rerollDices: function(){
            if ($.numbers.app.currentRerollStatus == false) {
                var indexes = [];
                for (var i = 0; i < $.numbers.app.currentSelected.length; i++) {
                    if ($.numbers.app.currentSelected[i] == true) indexes.push(i);
                }
                if (indexes.length > 0) $.numbers.app.currentRerollStatus = true;
                $.numbers.app.currentCombination.reroll( indexes );

                $.numbers.app.combinationsView.render();
            } else {
                console.log("already rerolled");
            }
        },
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