// Card.js

// Exportieren der Kartenfunktionalität als Modul
export class Card {
    constructor() {
        this.cards = [
            'img/card1.gif', 'img/card2.gif', // ...
            'img/card32.gif'
        ];
        this.shuffle();
    }

    extractCardNumber(card) {
        return parseInt(card.match(/\d+/)[0]);
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    get player1Cards() {
        return this.cards.slice(0, 10).sort((a, b) => this.extractCardNumber(a) - this.extractCardNumber(b));
    }

    get player2Cards() {
        return this.cards.slice(10, 20).sort((a, b) => this.extractCardNumber(a) - this.extractCardNumber(b));
    }

    get player3Cards() {
        return this.cards.slice(20, 30).sort((a, b) => this.extractCardNumber(a) - this.extractCardNumber(b));
    }

    get player4Cards() {
        return this.cards.slice(30, 32);
    }
}