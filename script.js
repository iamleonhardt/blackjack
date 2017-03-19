/**
 * Created by bill on 12/9/16.
 */

$("document").ready(function () {
    init();
});

function init(){
    deck = new Stack();
    discard = new Stack();
    deck.makeDeck(1);

    game = new GameController();
    game.display();
    game.createPlayers(game.numberOfPlayers);
}

/**
 * Stack Constructor
 * @constructor
 */
function Stack() {
    this.cards = [];

    this.makeDeck = stackMakeDeck;
    this.shuffle = stackShuffle;
    this.dealCard = stackDealCard;
    this.addCard = stackAddCard;
    this.combine = stackCombine;
    this.cardCount = stackCardCount;
}

function stackMakeDeck(numOfDecks) {
    var i;
    this.cards = [];
    this.cardNames = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.suits = ['heart', 'spade', 'club', 'diamond'];

    for (i = 0; i < numOfDecks; i++) {
        for (var suit in this.suits) {
            for (var card in this.cardNames) {
                this.cards.push(new Card(this.cardNames[card], this.suits[suit]));
            }
        }
    }
}

function stackShuffle(timesToShuffle) {
    var i, j, k;
    var temp;

    for (i = 0; i < timesToShuffle; i++) {
        for (j = 0; j < this.cards.length; j++) {
            k = game.getRanNum(0, this.cards.length -1);
            temp = this.cards[j];
            this.cards[j] = this.cards[k];
            this.cards[k] = temp;
        }
    }
    game.display();
}

function stackDealCard() {
    if (this.cards.length > 0) {
        return this.cards.pop();
    } else {
        return null;
    }
}

function stackAddCard (card){
    this.cards.push(card);
    game.display();
}

function stackCombine (stack){
    this.cards += stack.cards;
    stack.cards = [];
}

function stackCardCount (){
    return this.cards.length;
}

/**
 * GameController Constructor
 * @constructor
 */
function GameController() {
    this.playerNames = ["Charles", "John", "Jorge", "Mark", "Yaeri"];
    this.playerChips = [300, 300, 280, 300, 1000];

    this.numberOfPlayers = 5;
    this.playersArr = [];

    this.getRanNum = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    this.createPlayers = function (num) {
        var i;
        this.numberOfPlayers = num;
        for (i = 0; i < this.numberOfPlayers; i++) {
            tempPlayer = new Player(this.playerNames[i], this.playerChips[i]);
            tempPlayer.createDomElem();
            this.playersArr.push(tempPlayer);
        }
        console.log("PlayersArr is : ", this.playersArr);
    }

    // Updates Display of DOM
    this.display = function(){
        var divElem, left, top;
        var cardCount;

        // Display Deck Stack
        left = 0;
        top = 0;
        divElem = $("#deckDiv");
        while(divElem.find(".card").length > 0){
            divElem.empty();
        }
        cardCount = deck.cardCount();
        for (i = 0; i < cardCount; i++){
            card = deck.cards[i].createCardElem();
            card[0].style.left = left + 'px';
            card[0].style.top = top + 'px';
            divElem.append(card);
            left += 0;
            top += 15;
        }

        // Display Discard Stack
        left = 0;
        top = 0;
        divElem = $("#discardDiv");
        while(divElem.find(".card").length > 0){
            divElem.empty();
        }
        cardCount = discard.cardCount();
        for (i = 0; i < cardCount; i++){
            card = discard.cards[i].createCardElem();
            card[0].style.left = left + 'px';
            card[0].style.top = top + 'px';
            divElem.append(card);
            left += 0;
            top += 15;
        }

        // Display Player Stacks
        for (var player in game.playersArr){
            game.playersArr[player].cardLeft = 0;
            game.playersArr[player].cardTop = 0;


            playerStack = game.playersArr[player].stack;
            console.log('player is : ', game.playersArr[player]);
            divElem = $(game.playersArr[player].domElem[0].children[4]);
            console.log('divElem is : ', divElem);
            while(divElem.find(".card").length > 0){
                divElem.empty();
            }
            cardCount = playerStack.cardCount();
            console.log('cardCount is : ', cardCount);
            for (i = 0; i < cardCount; i++){
                card = playerStack.cards[i].createCardElem();
                card[0].style.left = game.playersArr[player].cardLeft + 'px';
                card[0].style.top = game.playersArr[player].cardTop + 'px';
                divElem.append(card);
                game.playersArr[player].cardLeft += 20;
                game.playersArr[player].cardTop += 80;
            }

        }


    }
}

/**
 * Card Constructor
 * @param name
 * @param suit
 * @constructor
 */
function Card(name, suit) {
    this.name = name;
    this.suit = suit;
}

Card.prototype.value = function () {
    if (this.name == "J" || "Q" || "K") {
        return [10];
    } else if (this.name == "A") {
        return [1, 11];
    } else {
        return parseInt(this.name, 10);
    }
};

Card.prototype.createCardElem = function() {
    var card = $("<div>", {
        class: 'card ' + this.suit,
        text: this.name
    });
    return card;
};

/**
 * Player Constructor
 * @param playerName
 * @param playerChipCount
 * @constructor
 */
function Player(playerName, playerChipCount) {
    var self = this;
    this.name = playerName;
    this.chipCount = playerChipCount;
    this.cardValueTotal = 0;
    this.cardLeft = 0;
    this.cardTop = 0;
    this.stack = new Stack();

    this.hitMe = function () {
        console.log(self.name + " knocks on the table");
        self.stack.addCard(deck.dealCard());
        console.log('this is : ', self);
        // game.dealCard(self);

    };
    this.hold = function () {
        console.log(self.name + " decides to hold")
    };

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
        });
        this.cardsDom = $("<div>", {
            class: 'playerCards'
        });
        // this.cards = $("<div>", {
        //     class: 'card ' + deck.suits[game.getRanNum(0, deck.suits.length - 1)],
        //     text: deck.cardNames[game.getRanNum(0, deck.cardNames.length - 1)]
        // });
        $(this.cardsDom).append(this.cards);
        $(this.domElem).append(this.nameDom, this.chipsDom, this.hitBtn, this.holdBtn, this.cardsDom);
        $(this.holdBtn).click(this.hold);
        $(this.hitBtn).click(this.hitMe);
        $("#gameArea").append(this.domElem);
    }

}
