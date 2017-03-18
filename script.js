/**
 * Created by bill on 12/9/16.
 */

$("document").ready(function () {
    game.createPlayers(game.numberOfPlayers);
})



// Game Controller
function GameController (){
    this.numberOfPlayers = 5;
    this.playerNames = ["Charles", "John", "Jorge", "Mark", "Yaeri"];
    this.playerChips = [300, 300, 280, 300, 1000];
    this.playersArr = [];

    this.dealCard = function(thisPlayer){
        var cards = $("<div>", {
            class: 'card ' + game.suits[game.getRanNum(0, game.suits.length-1)],
            text: game.cardNames[game.getRanNum(0, game.cardNames.length-1)]
        });
        $(thisPlayer.domElem[0].lastChild).append(cards);
    }

    this.getRanNum = function (min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    this.createPlayers = function (num) {
        this.numberOfPlayers = num;
        for (var i = 0; i < this.numberOfPlayers; i++) {
            tempPlayer = new Player(this.playerNames[i], this.playerChips[i]);
            tempPlayer.createDomElem();
            this.playersArr.push(tempPlayer);
        }
        console.log("PlayersArr is : ", this.playersArr);
    }
}

var game = new GameController();
var deck = new Deck();

// Deck Constructor
function Deck(){
    this.cards = [];
    this.cardNames = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.suits = ['heart', 'spade', 'club', 'diamond'];

    this.deck = [];
    this.makeDeck = function(){
        for (var suit in this.suits){
            for(var card in this.cardNames){
                this.cards.push(new Card(this.cardNames[card], this.suits[suit]));
            }
        }
    };
    this.dealCard = function(){

    }
}


// Card Constructor
function Card(name, suit) {
    this.name = name;
    this.suit = suit;
}

Card.prototype.image = function () {
    return "http://www.jonarnaldo.com/sandbox/deck_images/" + name + "_of_" + suit + ".png";
};

Card.prototype.value = function () {
    if (this.name == "J" || "Q" || "K") {
        return [10];
    } else if (this.name == "A") {
        return [1, 11];
    } else {
        return parseInt(this.name, 10);
    }
};

// Player Constructor
function Player(playerName, playerChipCount) {
    var self = this;
    this.name = playerName;
    this.chipCount = playerChipCount;
    this.cardValueTotal = 0;
    this.playerCards = [];

    this.hitMe = function(){
        console.log(self.name + " knocks on the table");
        game.dealCard(self);
    }
    this.hold = function(){
        console.log(self.name + " decides to hold")
    }

    this.createDomElem = function () {
        this.domElem = $("<div>", {
            class: "player"
        });
        this.nameDom = $("<div>", {
                class: 'playerName',
                text: this.name
            });
        this.chipsDom = $("<div>", {
                class: 'playerChips',
                text: this.chipCount
            });
        this.hitBtn = $("<div>", {
            class: "actionBtns",
            text: "Hit"
        });
        this.holdBtn = $("<div>", {
            class: "actionBtns",
            text: "Hold"
        })
        this.cardsDom = $("<div>", {
            class: 'playerCards'
        });
        this.cards = $("<div>", {
            class: 'card ' + deck.suits[game.getRanNum(0, deck.suits.length-1)],
            text: deck.cardNames[game.getRanNum(0, deck.cardNames.length-1)]
        });
        $(this.cardsDom).append(this.cards);
        $(this.domElem).append(this.nameDom, this.chipsDom, this.hitBtn, this.holdBtn, this.cardsDom);
        $(this.holdBtn).click(this.hold);
        $(this.hitBtn).click(this.hitMe);
        $("#gameArea").append(this.domElem);
    }

}


