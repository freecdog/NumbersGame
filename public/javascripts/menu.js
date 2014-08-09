/**
 * Created by jaric on 10.08.2014.
 */

(function($) {
    $.menu = {};

    // Models


    $.menu.User = Backbone.Model.extend({
        urlRoot: '/api/newUserSpecial',
        defaults: {
            login: 'player' + (10000 * Math.random()).toFixed(0)
        },
        initialize: function() {
            console.log('User initialized');
        },
        login: function(attributes, callback){
            this.save(attributes, callback);
            this.unset('password');
        }
    });

    // Views

    $.menu.InputLoginView = Backbone.View.extend({
        tagName: 'input',
        className: 'inputView',
        initialize: function(){
            //this.$el.attr('contentEditable',true);
            this.$el.attr('name', 'login');
            this.$el.attr('placeholder', this.model.attributes.login);

            this.$el.attr('pattern','.{3,16}');
            this.$el.attr('required', true);
            this.$el.attr('title', 'min 3, max 16');
            //this.listenTo(this.options.parent.model, "change:names", this.listener);
        },
        render: function(){
            this.$el.empty();
            //this.$el.append("asdf");
            return this;
        }
    });
    $.menu.InputFormView = Backbone.View.extend({
        tagName: 'form',
        id: 'auth',
        //className: 'inputPasswordView',

        initialize: function () {
            this.initViews();

            this.render();
        },
        initViews: function(){
            this.inputLoginView = new $.menu.InputLoginView({model: this.model});
            this.inputLoginView.render();
        },

        events : {
            // https://developer.mozilla.org/en-US/docs/Web/Events
            //"change" : "change",
            "submit" : "newUser"
        },
        newUser : function(event) {
            var self = this;

            console.log('trying to create new user');
            event.preventDefault();

            this.model.set({
                login: this.el.elements["login"].value,
                password: this.el.elements["password"].value
            });

            this.model.login(null, {
                success: function(model,values) {
                    console.log("User created", model, values);
                    alert("User created");

                    //self.el.elements["login"].value.clear();
                    //self.el.elements["password"].value.clear();

                    self.render();
                },
                error: function( model, response) {
                    console.log("Could not create user:", response);
                    alert("Could not create user, no permission");
                }
            });
            event.currentTarget.checkValidity();
            return false;
        },
        titleTemplate: _.template('<div class="manageTitle jGreen">Name:</div>'),
        render: function(){
            this.$el.empty();

            //this.$el.append(this.titleTemplate());

            this.$el.append("<br>");
            this.$el.append(this.inputLoginView.el);
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
            $body.prepend(inputFormView.render().el);
        }
    });

    // App

    $.menu.app = null;

    $.menu.bootstrap = function(){
        $.menu.app = new $.menu.Router();
        Backbone.history.start({pushState: true});
    };
})(jQuery);