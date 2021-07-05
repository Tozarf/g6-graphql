const { ApolloServer, gql } = require("apollo-server");
class Deck {
  numbers = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  suits = ["♣", "♦", "♥", "♠"];

  cards = [];

  constructor() {
    this.createNewDeck();
  }

  dispatchCards = (size, playersNumber = 5) => {
    if (size * playersNumber > this.cards.length) {
      this.createNewDeck();
    }

    return new Array(size)
      .fill()
      .map(
        () =>
          this.cards.splice(parseInt(Math.random() * this.cards.length), 1)[0]
      );
  };

  createNewDeck = () => {
    this.cards = [];
    this.suits.forEach((suit) => {
      this.numbers.forEach((face) => {
        this.cards.push(face + suit);
      });
    });
  };
}

class Hand {
  cards = [];
  constructor(deck, size) {
    this.cards = deck.dispatchCards(size);
  }
}

module.exports = { Deck, Hand };

const typeDefs = gql`
  type Card {
    number: String
    symbol: String
  }

  type Query {
    table: [Card]
    getCards(cards: Int): [Card]
  }

  type Mutation {
    restoreCards: String
  }
`;

let deck = new Deck();
let table = deck.dispatchCards(5);

const resolvers = {
  Query: {
    table: () => table,
    getCards: (_, { cards }) => {
      return deck.dispatchCards(cards);
    },
  },
  Mutation: {
    restoreCards: () => {
      deck = new Deck();
      table = deck.dispatchCards(5);
      return `OK!`;
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
