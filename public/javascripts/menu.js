/**
 * Created by jaric on 10.08.2014.
 */

(function($) {
    $.menu = {};

    // Models


    $.menu.User = Backbone.Model.extend({
        urlRoot: '/api/changeName',
        defaults: {
            name: 'player' + (10000 * Math.random()).toFixed(0)
        },
        initialize: function() {
            console.log('User initialized');
        },
        changeName: function(attributes, callback){
            var oldRoot = this.urlRoot;
            this.urlRoot += "/" + this.attributes.name;
            //this.fetch(attributes, callback);
            this.fetch(attributes)
                .done(callback.success)
                .fail(callback.error);
            this.urlRoot = oldRoot;
        }
    });

    // Views

    $.menu.InputLoginView = Backbone.View.extend({
        tagName: 'input',
        className: 'inputView',
        initialize: function(){
            var self = this;
            console.log("this", this);
            //this.$el.attr('contentEditable',true);
            this.$el.attr('name', 'name');
            this.$el.attr('placeholder', "nickname");

            this.$el.attr('pattern','.{3,16}');
            this.$el.attr('required', true);
            this.$el.attr('title', 'min 3, max 16');
            //this.listenTo(this.options.parent.model, "change:names", this.listener);
            this.el.addEventListener('input', function(){
                self.changeVisibility();
            }, false);
        },
        // events won't work, so I use "addEventListener", so sad =/
        //events: function(){console.log("anything");},
        /*events: {
            // https://developer.mozilla.org/en-US/docs/Web/Events
            //"change" : "changeSmth"
            "input" : "changeSmth"
        },*/
        changeVisibility: function(){
            this.options.parent.inputSubmitView.changeVisibility(this);
        },
        render: function(){
            this.$el.empty();
            //this.$el.append("asdf");
            return this;
        }
    });
    $.menu.InputSubmitView = Backbone.View.extend({
        tagName: 'input',
        className: 'inputSubmitView',
        initialize: function(){
            this.$el.attr('type','submit');
            this.$el.attr('value','[change]');

            this.lastChanger = this.options.parent.inputLoginView;
            // impossible for mobile devices =/
            //this.$el.css('display','none');
        },
        changeVisibility: function(changer){
            if (this.lastChanger != changer) {
                this.$el.toggle("display");
                this.lastChanger = changer;
            }
        },
        buttonTemplate: _.template("[change]"),
        render: function() {
            this.$el.empty();
            this.$el.append(this.buttonTemplate());
            return this;
        }
    });
    $.menu.InputFormView = Backbone.View.extend({
        tagName: 'form',
        id: 'changeNameForm',
        //className: 'inputPasswordView',

        initialize: function () {
            this.initViews();

            this.render();
        },
        initViews: function(){
            this.inputLoginView = new $.menu.InputLoginView({model: this.model, parent: this});
            this.inputLoginView.render();

            this.inputSubmitView = new $.menu.InputSubmitView({parent: this});
            this.inputSubmitView.render();
        },

        events : {
            // https://developer.mozilla.org/en-US/docs/Web/Events
            //"change" : "change",
            "submit" : "tryChangeName"
        },
        tryChangeName : function(event) {
            var self = this;

            console.log('trying to change name');
            event.preventDefault();

            this.model.set({
                name: this.el.elements["name"].value
            });

            this.model.changeName(null, {
                success: function(model,values) {
                    console.log("User name changed", model, values);
                    self.inputSubmitView.changeVisibility(self);
                    //self.inputSubmitView.$el.toggle("display");
                    self.render();
                },
                error: function( model, response) {
                    console.log("Could not create user:", response);
                    alert("Try one more time please");
                }
            });
            event.currentTarget.checkValidity();
            return false;
        },
        titleTemplate: _.template('<div class="manageTitle jGreen">Name:</div>'),
        render: function(){
            this.$el.empty();

            //this.$el.append(this.titleTemplate());

            this.$el.append(this.inputLoginView.el);
            this.$el.append(this.inputSubmitView.el);
            //this.$el.append("<br>");

            return this;
        }
    });

    // Router

    // looks like main application class
    $.menu.Router = Backbone.Router.extend({
        routes: {
            "": "menu"
        },
        initialize: function(){
            console.log("1. app init");
        },

        menu: function(){
            console.log("2. app route");

            var $body = $('body');

            this.userModel = new $.menu.User();
            var inputFormView = new $.menu.InputFormView({model: this.userModel});
            $('#nameForm').prepend(inputFormView.render().el);
        }
    });

    // App

    $.menu.app = null;

    $.menu.bootstrap = function(){
        $.menu.app = new $.menu.Router();
        Backbone.history.start({pushState: true});
    };
})(jQuery);