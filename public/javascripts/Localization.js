/**
 * Created by jaric on 19.09.2014.
 */

// for client side underscore should be loaded before this script in other case this script will fail
_ = typeof exports === 'undefined'? _ : require('underscore')._;

(function(_, exports){

    var listOfLanguages = [];

    var englishLanguage = {
        "name": "en",
        "Play": {
            "Buttons": {
                "restart": "restart",
                "reroll": "reroll",
                "accept": "accept"
            },
            "Statuses": {
                "20": "game in progress",
                "90": "game is finished, touch [restart] to play again",
                "-1": "game is abandoned, touch [restart] to play again",
                "undefined": "searching for a game, if nothing is happening for too long touch [restart]",
                "other": "unknown state, touch [restart] to play again"
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
            "Winners": {
                "winner": "Winner is",
                "results": "Results:"
            },
            "Other": {
                "playersSearching": ", players searching now: ",
                "total": "total: "
            }
        },
        "Menu": {
            "menu": "Menu",
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
    var russianLanguage = {
        "name": "ru",
        "Play": {
            "Buttons": {
                "restart": "рестарт",
                "reroll": "перекинуть",
                "accept": "принять"
            },
            "Statuses": {
                "20": "игра идет",
                "90": "игра закончилась, нажмите [рестарт] чтобы начать заново",
                "-1": "игра заброшена, нажмите [рестарт] чтобы начать заново",
                "undefined": "поиск игры, если долго ничего не происходит — нажмите [рестарт]",
                "other": "неизвестное состояние, нажмите [рестарт]"
            },
            "Combinations": {
                "ones": "Единицы",
                "twos": "Двойки",
                "threes": "Тройки",
                "fours": "Четверки",
                "fives": "Пятерки",
                "sixes": "Шестерки",
                "3ofaKind": "Сет",
                "4ofaKind": "Каре",
                "fullHouse": "Фул-хаус",
                "smallStraight": "Маленькая улица",
                "largeStraight": "Большая улица",
                "yatzy": "Язь",
                "chance": "Шанс"
            },
            "Winners": {
                "winner": "Победитель",
                "results": "Результаты:"
            },
            "Other": {
                "playersSearching": ", количество игроков ищуших игру: ",
                "total": "итого: "
            }
        },
        "Menu": {
            "menu": "Меню",
            "play": "Играть",
            "onlineStatistics": "Статистика игр",
            "rules": "Правило",
            "about": "О проекте"
        },
        "About": {
            "text1": "Привет, меня зовут Ярик, я автор этого приложения, рад вас видеть! Спасибо, что вы здесь. Надеюсь, вам здесь нравится!",
            "text2": "Андрей готовит версию для Windows Phone",
            "text3": "По всем вопросам вы можете обращаться по адресу at mm1000@list.ru",
            "text4": "Под влиянием от Паши, Ани и Лены."
        },
        "Rules": {
            "bonus": "Если к концу игры сумма единичек, двоек, троек, четверок, пятерок и шестерок больше либо равна 64, вы получите дополнительные 35 очков."
        }
    };
    var deutchLanguage = {
        "name": "de",
        "Play": {
            "Combinations": {
                "ones": "1er",
                "twos": "2er",
                "threes": "3er",
                "fours": "4er",
                "fives": "5er",
                "sixes": "6er",
                "3ofaKind": "Dreir pasch",
                "4ofaKind": "Vierer pasch",
                "fullHouse": "Full house",
                "smallStraight": "Kleine straße",
                "largeStraight": "Große straße",
                "yatzy": "Yazzee",
                "chance": "Chance"
            }
        }
    };

    function jsonToLanguagePack(language){
        // load base(english) values, to fill all objects (if language isn't full)
        var lp = _.extend({}, englishLanguage);
        // load language values
        _.extend(lp, language);

        return lp;
    }
    function exportLanguage(language){
        var languageName = language.name;
        listOfLanguages.push(languageName);
        exports[languageName] = jsonToLanguagePack(language);
    }
    exportLanguage(englishLanguage);
    exportLanguage(russianLanguage);
    exportLanguage(deutchLanguage);

    var language = 'en';
    exports.defaultLanguage = function(){return 'en';};
    exports.currentLanguage = function(){return language;};
    exports.listOfLanguages = listOfLanguages;

})(_, typeof exports === 'undefined'? this['Localization']={} : exports);