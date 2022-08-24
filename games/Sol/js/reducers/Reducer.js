import GameContext from "../context/GameContext";
import { consts } from "../constants/Constants";

export const stockReducer = (state = GameContext.stock, action) => {
  switch (action.type) {
    case "RESET": {
      return {
        ...state,
        ...action.initialData.stock
      };
    }
    case "FLOP": {
      let flopped = [...state.flopped];
      let tempFlop = [...state.tempFlop];
      if (flopped && flopped.length) {
        let len = flopped.length;
        for (let i = 0; i < len; i++) {
          let lastCard = flopped.pop();
          lastCard.turned = false;
          lastCard.locked = false;
          tempFlop.push(lastCard);
        }
      }
      let rest = [...state.rest];
      if (rest.length === 0) {
        tempFlop.reverse();
        rest = [...tempFlop];
        tempFlop = [];
      }
      let first, second;
      if (action.noCards !== 1) {
        first = rest.pop();
        second = rest.pop();
      }
      const third = rest.pop();

      if (third !== undefined) {
        let lastc = action.noCards !== 1 ? false : true;
        let lockedc = action.noCards !== 1 ? true : false;
        flopped.push(
          Object.assign({}, third, {
            turned: true,
            locked: lockedc,
            last: lastc
          })
        );
      }
      if (action.noCards !== 1) {
        if (second !== undefined) {
          flopped.push(
            Object.assign({}, second, {
              turned: true,
              locked: true,
              last: false
            })
          );
        }
        if (first !== undefined) {
          flopped.push(
            Object.assign({}, first, {
              turned: true,
              locked: false,
              last: true
            })
          );
        }
      }
      return {
        rest,
        flopped,
        tempFlop
      };
    }
    case "DROP": {
      const topFlop = state.flopped[state.flopped.length - 1];
      if (
        topFlop !== undefined &&
        topFlop.suit === action.suit &&
        topFlop.number === action.number
      ) {
        // The top of the flopped cards has been moved
        let flopped = [];
        if (state.flopped.length > 2) {
          flopped = flopped.concat(state.flopped.slice(0, -2));
        }
        if (state.flopped.length > 1) {
          flopped.push(
            Object.assign({}, state.flopped[state.flopped.length - 2], {
              locked: false,
              last: true
            })
          );
        }
        return {
          rest: state.rest,
          flopped,
          tempFlop: state.tempFlop
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
};

export const foundationReducer = (state = GameContext.foundation, action) => {
  switch (action.type) {
    case "RESET": {
      return action.initialData.foundation;
    }
    case "DRAG_START": {
      if (action.last !== true) {
        return state;
      }
      function match(targetCard, draggedCard) {
        if (targetCard === undefined && draggedCard.number === "A") {
          return true;
        }
        if (targetCard === undefined) {
          return false;
        }
        return (
          targetCard.suit === draggedCard.suit &&
          ((targetCard.number === "A" && draggedCard.number === 2) ||
            (targetCard.number === 10 && draggedCard.number === "J") ||
            (targetCard.number === "J" && draggedCard.number === "Q") ||
            (targetCard.number === "Q" && draggedCard.number === "K") ||
            targetCard.number + 1 === draggedCard.number)
        );
      }

      let draggedCard = { suit: action.suit, number: action.number };
      return state.map((pile) => ({
        drop: match(pile.cards[pile.cards.length - 1], draggedCard),
        cards: [...pile.cards]
      }));
    }
    case "DRAG_END": {
      return state.map((pile) => ({
        drop: false,
        cards: [...pile.cards]
      }));
    }
    case "DROP": {
      function match(card, suit, number) {
        return (
          card !== undefined && card.suit === suit && card.number === number
        );
      }

      // Check if the moved card belonged to the foundation piles
      const sourcePileIndex = state.findIndex((pile) =>
        match(pile.cards[pile.cards.length - 1], action.suit, action.number)
      );

      return state.map((pile, pileIndex) => {
        // Add the card to the corresponding pile if the target is a foundation pile
        if (
          action.targetPileType === consts.FOUNDATION &&
          action.targetPileIndex === pileIndex
        ) {
          return {
            drop: false,
            cards: [
              ...pile.cards.map((card) => ({
                suit: card.suit,
                number: card.number,
                turned: true,
                locked: true,
                last: false
              })),
              {
                suit: action.suit,
                number: action.number,
                turned: true,
                locked: false,
                last: true
              }
            ]
          };
        }
        // Remove the card from if it has been part of a foundation pile
        if (sourcePileIndex !== undefined && sourcePileIndex === pileIndex) {
          let cards = [];
          if (pile.cards.length > 2) {
            cards = cards.concat(pile.cards.slice(0, -2));
          }
          if (pile.cards.length > 1) {
            cards.push(
              Object.assign({}, pile.cards[pile.cards.length - 2], {
                locked: false,
                last: true
              })
            );
          }
          return {
            drop: false,
            cards
          };
        }
        // Return the pile unchanged if it has not been affected by the drop
        return pile;
      });
    }
    default: {
      return state;
    }
  }
};

export const tableauReducer = (state = GameContext.tableau, action) => {
  switch (action.type) {
    case "RESET": {
      // turn back the cards here
      // const tCards = action.initialData.tableau;
      // tCards.forEach((element) => {
      //   const cards = element.cards;
      //   cards.forEach((ee) => {
      //     const ele = document.getElementById(ee.suit + ee.number);
      //     ele.children[0].setAttribute("style", "transform: rotateY(-180deg);");
      //     ele.children[1].setAttribute("style", "transform: rotateY(0deg);");
      //   });
      // }); did not work
      return action.initialData.tableau;
    }
    case "CLICK": {
      // create list of places the card can move
      // if list has some places, move to first
      // trigger drop on the pile
      return true;
    }
    case "DRAG_START": {
      function match(targetCard, draggedCard) {
        if (targetCard === undefined && draggedCard.number === "K") {
          return true;
        }
        if (targetCard === undefined) {
          return false;
        }
        return (
          ((targetCard.number === "K" && draggedCard.number === "Q") ||
            (targetCard.number === "Q" && draggedCard.number === "J") ||
            (targetCard.number === "J" && draggedCard.number === 10) ||
            targetCard.number === draggedCard.number + 1) &&
          (((targetCard.suit === consts.HEART ||
            targetCard.suit === consts.TILE) &&
            (draggedCard.suit === consts.CLOVER ||
              draggedCard.suit === consts.PIKE)) ||
            ((targetCard.suit === consts.CLOVER ||
              targetCard.suit === consts.PIKE) &&
              (draggedCard.suit === consts.HEART ||
                draggedCard.suit === consts.TILE)))
        );
      }
      let draggedCard = { suit: action.suit, number: action.number };
      return state.map((pile) => ({
        drop: match(pile.cards[pile.cards.length - 1], draggedCard),
        cards: [...pile.cards]
      }));
    }
    case "DRAG_END": {
      return state.map((pile) => ({
        drop: false,
        cards: [...pile.cards]
      }));
    }
    case "DROP": {
      function match(card, suit, number) {
        return (
          card !== undefined && card.suit === suit && card.number === number
        );
      }
      // const tableauState = state;
      const [tableauWithoutMovingCards, movingCards] = state.reduce(
        (accumulated, currentPile) => {
          const index = currentPile.cards.findIndex((card) =>
            match(card, action.suit, action.number)
          );
          if (index !== -1) {
            let cards = [];
            if (index > 1) {
              cards = cards.concat(
                currentPile.cards.slice(0, index - 1).map((card) => ({
                  suit: card.suit,
                  number: card.number,
                  turned: card.turned,
                  locked: card.locked,
                  last: false
                }))
              );
            }
            if (index > 0) {
              cards.push(
                Object.assign({}, currentPile.cards[index - 1], {
                  locked: false,
                  last: true,
                  turned: true
                })
              );
              // let cc = currentPile.cards[index - 1];
              // cc.locked = false;
              // cc.turned = true;
            }
            accumulated[0].push({
              drop: false,
              cards
            });
            accumulated[1] = currentPile.cards.slice(index).map((card) => ({
              suit: card.suit,
              number: card.number,
              turned: true,
              locked: false,
              last: card.last
            }));
          } else {
            accumulated[0].push(currentPile);
          }
          return accumulated;
        },
        [
          [
            // Tableau without moving cards
          ],
          [
            // Moving cards default (overwritten if source found in a tableau pile)
            {
              suit: action.suit,
              number: action.number,
              turned: true,
              locked: false,
              last: true
            }
          ]
        ]
      );
      if (action.targetPileType === consts.TABLEAU) {
        tableauWithoutMovingCards[action.targetPileIndex] = {
          drop: false,
          cards: tableauWithoutMovingCards[action.targetPileIndex].cards
            .map((card) => ({
              suit: card.suit,
              number: card.number,
              turned: card.turned,
              locked: card.locked,
              last: false
            }))
            .concat(movingCards)
        };
        return tableauWithoutMovingCards;
      }
      return tableauWithoutMovingCards;
    }
    default: {
      return state;
    }
  }
};

export const optionsReducer = (state = GameContext.options, action) => {
  switch (action.type) {
    case "RESET": {
      return {
        ...action.initialData.options,
        bgImg: state.bgImg,
        music: state.music,
        track: state.track,
        cards: state.cards,
        clickPlay: state.clickPlay,
        autoPlay: state.autoPlay
      };
    }
    case "TIME": {
      return {
        ...state,
        time: action.time
      };
    }
    case "TIMER_ACTIVE": {
      return {
        ...state,
        timerActive: action.timerActive
      };
    }
    case "MUSIC": {
      return {
        ...state,
        music: action.music
      };
    }
    case "AUDIO": {
      return {
        ...state,
        track: action.track
      };
    }
    case "CARDS": {
      return {
        ...state,
        cards: action.cards
      };
    }
    case "CLICK_PLAY": {
      return {
        ...state,
        clickPlay: action.clickPlay
      };
    }
    case "AUTO_PLAY": {
      return {
        ...state,
        autoPlay: action.autoPlay
      };
    }
    case "BG_IMG": {
      return {
        ...state,
        bgImg: action.bgImg
      };
    }
    case "ADD": {
      return {
        ...state,
        score: state.score + action.score,
        moves: state.moves++
      };
    }
    default: {
      return state;
    }
  }
};
