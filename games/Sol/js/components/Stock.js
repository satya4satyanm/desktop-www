import React, { useContext } from "react";
import Card from "./Card";
import GameContext from "../context/GameContext";

export const Stock = () => {
  // console.log(rest.length, flopped.length);
  let context = useContext(GameContext);
  let rest = context.state.stock.rest;
  let flopped = context.state.stock.flopped;
  let tempFlopped = context.state.stock.tempFlop;
  return (
    <div className="stock">
      {rest.length + flopped.length + tempFlopped.length > 0 && (
        <div
          className="reload-rest"
          onClick={() => {
            context.dispatch({
              type: "FLOP",
              noCards: context.state.options.cards
            });
          }}
        >
          {/* {rest.length > 0 && ( */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            scale="2"
          >
            <g transform="scale(1.5, 1.5)">
              <path
                fill="white"
                d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"
              />
            </g>
          </svg>
        </div>
      )}

      <div className="rest">
        {rest.map((card) => (
          <div
            className="cardContainer"
            key={JSON.stringify({
              suit: card.suit,
              number: card.number,
              df: "s"
            })}
          >
            <Card
              key={JSON.stringify({
                suit: card.suit,
                number: card.number,
                df: "s"
              })}
              suit={card.suit}
              number={card.number}
              stack={true}
              turned={card.turned}
              locked={card.locked}
              last={false}
              df="s"
              oc={false}
              // reducer={context.dispatchStock}
            />
          </div>
        ))}
      </div>
      <div className="flop">
        {flopped.map((card) => (
          <div
            className="cardContainer"
            key={JSON.stringify({ suit: card.suit, number: card.number })}
          >
            <Card
              key={JSON.stringify({ suit: card.suit, number: card.number })}
              suit={card.suit}
              number={card.number}
              stack={true}
              turned={card.turned}
              locked={card.locked}
              last={card.last}
              df="s"
              oc={false}
              // reducer={context.dispatchStock}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Stock;
