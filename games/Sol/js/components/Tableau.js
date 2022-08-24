import React, { useContext } from "react";
import Card from "./Card";
import DropSite from "./DropSite";
import { consts } from "../constants/Constants";
import GameContext from "../context/GameContext";

const Tableau = () => {
  let context = useContext(GameContext);
  let piles = context.state.tableau;
  return (
    <div className="tableau">
      {piles.map((pile, pileIndex) => (
        <div className="pile" key={pileIndex}>
          {pile.cards.map((card, index, pile) => {
            // debugger;
            return (
              <div
                className="cardContainer"
                key={JSON.stringify({
                  suit: card.suit,
                  number: card.number,
                  df: "t"
                })}
              >
                <Card
                  key={JSON.stringify({
                    suit: card.suit,
                    number: card.number,
                    df: "t"
                  })}
                  suit={card.suit}
                  number={card.number}
                  stack={false}
                  turned={card.turned}
                  locked={card.locked}
                  last={card.last}
                  df="t"
                  oc={index === 0}
                  prevCardTurned={
                    pile && index > 0 ? pile[index - 1].turned : null
                  }
                  // reducer={context.dispatchTableau}
                />
              </div>
            );
          })}
          <DropSite
            key={JSON.stringify({ type: consts.TABLEAU, index: pileIndex })}
            pileType={consts.TABLEAU}
            pileIndex={pileIndex}
            visible={pile.drop}
            // reducer={context.dispatchTableau}
          />
        </div>
      ))}
    </div>
  );
};
export default Tableau;
