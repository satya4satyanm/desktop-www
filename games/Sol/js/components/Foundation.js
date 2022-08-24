import React, { useContext } from "react";
import Card from "./Card";
import DropSite from "./DropSite";
import { consts } from "../constants/Constants";
import GameContext from "../context/GameContext";

const Foundation = () => {
  let context = useContext(GameContext);
  let piles = context.state.foundation;
  return (
    <div className="foundation">
      {piles.map((pile, pileIndex) => (
        <div className="pile" key={pileIndex}>
          {pile.cards.map((card) => (
            <div
              className="cardContainer"
              key={JSON.stringify({
                suit: card.suit,
                number: card.number,
                df: "f"
              })}
            >
              <Card
                key={JSON.stringify({
                  suit: card.suit,
                  number: card.number,
                  df: "f"
                })}
                suit={card.suit}
                number={card.number}
                turned={card.turned}
                locked={card.locked}
                last={card.last}
                df="f"
                oc={false}
                // reducer={context.dispatchFoundation}
              />
            </div>
          ))}
          <DropSite
            key={JSON.stringify({ type: consts.FOUNDATION, index: pileIndex })}
            pileType={consts.FOUNDATION}
            pileIndex={pileIndex}
            visible={pile.drop}
            // reducer={context.dispatchFoundation}
          />
        </div>
      ))}
    </div>
  );
};
export default Foundation;
