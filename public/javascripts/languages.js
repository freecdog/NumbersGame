/**
 * Created by jaric on 19.09.2014.
 */

(function(exports){

    var language = 'en';
    exports.defaultLanguage = function(){return 'en';};
    exports.currentLanguage = function(){return language;};
    exports.listOfLanguages = ['en', 'ru', 'de'];

    var englishLanguage = {
        "name": "en",
        "Play": {
            "Buttons": {
                "restart": "Restart",
                "reroll": "Reroll",
                "accept": "Accept"
            },
            "Statuses": {
                "20": "game in progress",
                "90": "game is finished, touch [restart] to play again",
                "undefined": "searching for a game, if nothing is happening for too long touch [restart]",
                "other": "unknown state"
            },
            "Combinations": {
                "ones": "Ones",
                "twos": "Twos",
                "threes": "Threes",
                "fours": "Fours",
                "fives": "Fives",
                "sixes": "Sixes",
                "3ofaKind": "3 of a kind",
                "4ofaKind": "4 of a kind",
                "fullHouse": "Full house",
                "smallStraight": "Small straight",
                "largeStraight": "Large straight",
                "yatzy": "Yatzy",
                "chance": "Chance"
            },
            "Other": {
                "playersSearching": "players searching now: "
            }
        },
        "Menu": {
            "play": "Play",
            "onlineStatistics": "Online Statistics",
            "rules": "Rules",
            "about": "About"
        },
        "About": {
            "text1": "Hi, I'm Jaric, the author of this app, nice to meet you! Thank you so much for being here. I hope you enjoy it!",
            "text2": "Windows Phone app by Andrey is coming soon.",
            "text3": "Feel free to contact me at mm1000@list.ru",
            "text4": "Inspired by Pavel, and Ann, and Elena."
        },
        "Rules": {
            "bonus": "If in the end of game sum of 1er, 2er, 3er, 4er, 5er, 6er is more or equal 63, you will get additional 35 points."
        }
    };

    function jsonToLanguagePack(obj){
        var lp = {};
        lp.Play = {};
        lp.Play.Combinations = {};

        lp.Menu = {};
        lp.Menu.Play = englishLanguage

        lp.About = {};

        lp.Rules = {};

        return lp;
    }
    jsonToLanguagePack(englishLanguage);

})(typeof exports === 'undefined'? this['localization']={} : exports);