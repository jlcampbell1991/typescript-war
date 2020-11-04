var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Black"] = 1] = "Black";
})(Color || (Color = {}));
var Suit;
(function (Suit) {
    Suit[Suit["Clubs"] = 1] = "Clubs";
    Suit[Suit["Spades"] = 2] = "Spades";
    Suit[Suit["Hearts"] = 3] = "Hearts";
    Suit[Suit["Diamonds"] = 4] = "Diamonds";
})(Suit || (Suit = {}));
var suits = [Suit.Clubs, Suit.Spades, Suit.Hearts, Suit.Diamonds];
var CardValue;
(function (CardValue) {
    CardValue[CardValue["Ace"] = 1] = "Ace";
    CardValue[CardValue["Two"] = 2] = "Two";
    CardValue[CardValue["Three"] = 3] = "Three";
    CardValue[CardValue["Four"] = 4] = "Four";
    CardValue[CardValue["Five"] = 5] = "Five";
    CardValue[CardValue["Six"] = 6] = "Six";
    CardValue[CardValue["Seven"] = 7] = "Seven";
    CardValue[CardValue["Eight"] = 8] = "Eight";
    CardValue[CardValue["Nine"] = 9] = "Nine";
    CardValue[CardValue["Ten"] = 10] = "Ten";
    CardValue[CardValue["Jack"] = 11] = "Jack";
    CardValue[CardValue["Queen"] = 12] = "Queen";
    CardValue[CardValue["King"] = 13] = "King";
})(CardValue || (CardValue = {}));
var cardValues = [CardValue.Ace, CardValue.Two, CardValue.Three, CardValue.Four, CardValue.Five, CardValue.Six, CardValue.Seven, CardValue.Eight, CardValue.Nine, CardValue.Ten, CardValue.Jack, CardValue.Queen, CardValue.King];
function shuffle(cards) {
    return cards.sort(function () { return Math.random() - 0.5; });
}
var Deck = /** @class */ (function () {
    function Deck() {
        var cards = [];
        // TOFIX: This ought to be flatMap.
        // TOFIX: Prefer `this.cards = suits.map...`
        suits.map(function (suit, _) {
            cardValues.map(function (value, _) {
                var c = { value: value, suit: suit };
                cards.push(c);
            });
        });
        this.cards = shuffle(cards);
    }
    return Deck;
}());
var Player = /** @class */ (function () {
    function Player(name, library) {
        this.name = name;
        this.library = library;
        this.field = [];
        this.discard = [];
    }
    Player.prototype.canDraw = function () {
        return this.library.length > 0;
    };
    Player.prototype.hasLost = function () {
        return !this.canDraw()
            && this.discard.length < 1;
    };
    Player.prototype.activeCard = function () {
        return this.field[0];
    };
    Player.prototype.draw = function (log) {
        function _draw(player) {
            var card = player.library[0];
            player.field.unshift(card);
            player.library.shift;
            return player.name + " players a " + card.value + " of " + card.suit + ".";
        }
        if (this.canDraw()) {
            log.push(_draw(this));
        }
        else if (!this.hasLost()) {
            this.library = shuffle(this.discard);
            this.discard = [];
            log.push(this.name + " shuffles his discard pile into his library.");
            log.push(_draw(this));
        }
        else {
            log.push("{this.name} has lost!");
        }
        return log;
    };
    Player.prototype.war = function (log) {
        for (var i = 0; i <= 3; i++) {
            log.concat(this.draw(log));
        }
        return log;
    };
    Player.prototype.librarySize = function () {
        var totalCards = (this.discard.length + this.library.length).toString();
        return this.name + " has " + totalCards + " cards left.";
    };
    Player.prototype.winBattle = function (cards, log) {
        this.discard = this.discard.concat(cards).concat(this.field);
        this.field = [];
        log.push(this.name + " wins the battle.");
        log.push(this.librarySize());
        return log;
    };
    Player.prototype.loseBattle = function (log) {
        this.field = [];
        log.push(this.name + " loses the battle.");
        log.push(this.librarySize());
        return log;
    };
    return Player;
}());
var Game = /** @class */ (function () {
    function Game() {
        var deck = new Deck;
        var p1Cards = deck.cards.slice(0, deck.cards.length / 2);
        var p2Cards = deck.cards.slice((deck.cards.length / 2), deck.cards.length);
        this.p1 = new Player("Player 1", p1Cards);
        this.p2 = new Player("Player 2", p2Cards);
        this.log = [];
    }
    Game.prototype.draw = function () {
        this.log = this.p1.draw(this.log);
        this.log = this.p2.draw(this.log);
    };
    Game.prototype.war = function () {
        this.log = this.p1.war(this.log);
        this.log = this.p2.war(this.log);
        this.log.push("Prepare for war!");
    };
    Game.prototype.battle = function () {
        var p1Card = this.p1.activeCard();
        var p2Card = this.p2.activeCard();
        if (p1Card.value > p2Card.value) {
            this.log = this.p1.winBattle(this.p2.field, this.log);
            this.log = this.p2.loseBattle(this.log);
        }
        else if (p1Card.value < p2Card.value) {
            this.log = this.p2.winBattle(this.p1.field, this.log);
            this.log = this.p1.loseBattle(this.log);
        }
        else {
            this.war();
        }
    };
    Game.prototype.play = function () {
        while (!this.p1.hasLost() || !this.p2.hasLost()) {
            this.draw();
            this.battle();
        }
        console.log("Game is over.  Here are the results:");
        for (var msg in this.log) {
            console.log(msg);
        }
    };
    return Game;
}());
var game = new Game;
game.play();
