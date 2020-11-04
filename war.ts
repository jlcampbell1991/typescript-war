enum Color {
  Red,
  Black
}
enum Suit {
  Clubs = 1,
  Spades = 2,
  Hearts = 3,
  Diamonds = 4
}
const suits: Array<Suit> = [Suit.Clubs, Suit.Spades, Suit.Hearts, Suit.Diamonds]

enum CardValue {
 	Ace = 1,
	Two = 2,
	Three = 3,
	Four = 4,
	Five = 5,
	Six = 6,
	Seven = 7,
	Eight = 8,
	Nine = 9,
	Ten = 10,
	Jack = 11,
	Queen = 12,
	King = 13
}
const cardValues: Array<CardValue> = [CardValue.Ace,CardValue.Two,CardValue.Three,CardValue.Four,CardValue.Five,CardValue.Six,CardValue.Seven,CardValue.Eight,CardValue.Nine,CardValue.Ten,CardValue.Jack,CardValue.Queen,CardValue.King]

interface Card {
  value: CardValue;
  suit: Suit;
}

function shuffle(cards: Cards): Cards {
  return cards.sort(() => Math.random() - 0.5);
}

class Deck {
  cards: Cards;

  constructor() {
    let cards: Cards = [];

    // TOFIX: This ought to be flatMap.
    // TOFIX: Prefer `this.cards = suits.map...`
    suits.map((suit, _) => {
      cardValues.map((value, _) => {
        const c: Card = { value: value, suit: suit };
        cards.push(c);
      })
    })

    this.cards = shuffle(cards);
  }
}

type Log = Array<string>;
type Cards = Array<Card>;

class Player {
  name: String;
  library: Cards;
  field:   Cards;
  discard: Cards;

  constructor(name: String, library: Cards) {
    this.name = name;
    this.library = library;
    this.field = [];
    this.discard = [];
  }

  private canDraw(): boolean {
    return this.library.length > 0;
  }

  hasLost(): boolean {
    return !this.canDraw()
      && this.discard.length < 1;
  }

  activeCard(): Card {
    return this.field[0];
  }

  draw(log: Log): Log {
    function _draw(player: Player): string {
      const card: Card = player.library[0];
      player.field.unshift(card);
      player.library.shift;
      return `${player.name} players a ${card.value} of ${card.suit}.`;
    }

    if(this.canDraw()) {
      log.push(_draw(this));
    } else if(!this.hasLost()) {
      this.library = shuffle(this.discard);
      this.discard = [];
      log.push(`${this.name} shuffles his discard pile into his library.`)
      log.push(_draw(this));
    } else {
      log.push(`{this.name} has lost!`)
    }

    return log;
  }

  war(log: Log): Log {
    for(let i = 0; i <= 3; i++) {
      log.concat(this.draw(log));
    }
    return log;
  }

  private librarySize(): string {
    const totalCards: String = (this.discard.length + this.library.length).toString();
    return `${this.name} has ${totalCards} cards left.`
  }

  winBattle(cards: Cards, log: Log): Log {
    this.discard = this.discard.concat(cards).concat(this.field);
    this.field = [];
    log.push(`${this.name} wins the battle.`);
    log.push(this.librarySize());
    return log;
  }

  loseBattle(log: Log): Log {
    this.field = [];
    log.push(`${this.name} loses the battle.`);
    log.push(this.librarySize());
    return log;
  }
}

class Game {
  p1: Player;
  p2: Player;
  log: Log;

  constructor() {
    let deck: Deck = new Deck;
    const p1Cards: Cards = deck.cards.slice(0, deck.cards.length / 2)
    const p2Cards: Cards = deck.cards.slice((deck.cards.length / 2), deck.cards.length)
    this.p1 = new Player("Player 1", p1Cards);
    this.p2 = new Player("Player 2", p2Cards);
    this.log = [];
  }

  draw(): void {
    this.log = this.p1.draw(this.log);
    this.log = this.p2.draw(this.log);
  }

  war(): void {
    this.log = this.p1.war(this.log);
    this.log = this.p2.war(this.log);
    this.log.push("Prepare for war!");
  }

  battle(): void {
    const p1Card = this.p1.activeCard();
    const p2Card = this.p2.activeCard();

    if(p1Card.value > p2Card.value) {
      this.log = this.p1.winBattle(this.p2.field, this.log);
      this.log = this.p2.loseBattle(this.log);
    } else if(p1Card.value < p2Card.value) {
      this.log = this.p2.winBattle(this.p1.field, this.log);
      this.log = this.p1.loseBattle(this.log);
    } else { this.war(); }
  }

  play() {
    while(!this.p1.hasLost() || !this.p2.hasLost()) {
      this.draw();
      this.battle();
    }

    console.log("Game is over.  Here are the results:");
    for(const msg in this.log) {
      console.log(msg);
    }
  }
}

const game: Game = new Game;
game.play();
