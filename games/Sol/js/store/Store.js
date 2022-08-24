import { consts } from "../constants/Constants";

function pop(cards, turned = false) {
  if (turned) {
    return { ...cards.shift(), turned: true, locked: false, last: true };
  } else {
    return { ...cards.shift(), turned: false, locked: true, last: false };
  }
}

export const generateCards = () => {
  function deck() {
    let cards = [];
    for (let i = 2; i <= 14; i++) {
      let number = i;
      if (i === 11) number = "J";
      if (i === 12) number = "Q";
      if (i === 13) number = "K";
      if (i === 14) number = "A";
      cards.push({ suit: consts.HEART, number });
      cards.push({ suit: consts.TILE, number });
      cards.push({ suit: consts.CLOVER, number });
      cards.push({ suit: consts.PIKE, number });
    }
    return cards;
  }

  function shuffle(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }

  let cards = deck();
  shuffle(cards);
  return cards;
};

let cards = generateCards();
let allCards = generateCards();

export const ginitialState = (cards) => {
  return {
    options: {
      time: 0,
      timerActive: true,
      score: 0,
      moves: 0,
      music: false,
      track: "0",
      cards: 3,
      clickPlay: "off",
      autoPlay: "off",
      bgImg: ""
    },
    tableau: [
      { drop: false, cards: [pop(cards, true)] },
      { drop: false, cards: [pop(cards), pop(cards, true)] },
      { drop: false, cards: [pop(cards), pop(cards), pop(cards, true)] },
      {
        drop: false,
        cards: [pop(cards), pop(cards), pop(cards), pop(cards, true)]
      },
      {
        drop: false,
        cards: [
          pop(cards),
          pop(cards),
          pop(cards),
          pop(cards),
          pop(cards, true)
        ]
      },
      {
        drop: false,
        cards: [
          pop(cards),
          pop(cards),
          pop(cards),
          pop(cards),
          pop(cards),
          pop(cards, true)
        ]
      },
      {
        drop: false,
        cards: [
          pop(cards),
          pop(cards),
          pop(cards),
          pop(cards),
          pop(cards),
          pop(cards),
          pop(cards, true)
        ]
      }
    ],
    stock: {
      rest: [
        ...cards.map((card) => ({
          suit: card.suit,
          number: card.number,
          turned: false,
          locked: false,
          last: false
        }))
      ],
      flopped: [],
      tempFlop: []
    },
    foundation: [
      { drop: false, cards: [] },
      { drop: false, cards: [] },
      { drop: false, cards: [] },
      { drop: false, cards: [] }
    ]
  };
};

let initialState = ginitialState(cards);

const Store = {
  initialState,
  cards: allCards,
  congratulation: true
};

export default Store;
