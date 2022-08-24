import React, { useState, useContext, useEffect } from "react";
import { Heart, Pike, Clover, Tile } from "./SuitShapes";
import { consts } from "../constants/Constants";
import GameContext from "../context/GameContext";
import { useSpring, animated } from "react-spring";

const Card = (props) => {
  let context = useContext(GameContext);
  function initiateTurn() {
    turn();
  }

  const [flipped, set] = useState(props.turned ? true : false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { duration: 250, mass: 2, tension: 500, friction: 80 }
  });

  useEffect(() => {
    if (props.turned && !flipped) {
      set(true);
    } else if (!props.turned && flipped) {
      set(false);
    }
  }, [props.turned, flipped]);

  function turn() {
    if (props.stack === true) {
      context.dispatch({
        type: "FLOP",
        noCards: context.state.options.cards
      });
    } else if (props.turned === true || props.locked) {
      return;
    }
  }

  function dragStart(ev) {
    ev.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        suit: props.suit,
        number: props.number,
        df: props.df /** dragged from */,
        last: props.last,
        oc: props.oc /** only card */,
        prevCardTurned: props.prevCardTurned
      })
    );
    context.dispatch({
      type: "DRAG_START",
      suit: props.suit,
      number: props.number,
      df: props.df,
      last: props.last,
      oc: props.oc,
      prevCardTurned: props.prevCardTurned
    });
  }

  function dragEnd(ev) {
    context.dispatch({ type: "DRAG_END" });
  }

  let suit;
  switch (props.suit) {
    case consts.HEART:
      suit = <Heart />;
      break;
    case consts.TILE:
      suit = <Tile />;
      break;
    case consts.CLOVER:
      suit = <Clover />;
      break;
    case consts.PIKE:
      suit = <Pike />;
      break;
    default:
      break;
  }
  return (
    <div className="card" id={props.suit + props.number}>
      <animated.div
        className="cardFace frontFace"
        style={{
          opacity,
          transform: transform.interpolate((t) => `${t} rotateY(180deg)`)
        }}
        draggable={props.locked === false}
        onDragStart={(ev) => dragStart(ev)}
        onDragEnd={(ev) => dragEnd(ev)}
      >
        <div className="left-suit">
          <h1 className={props.suit}>{props.number}</h1>
        </div>
        <div className="large-suit">{suit}</div>
        <div className="right-suit">
          <h1 className={props.suit}>{props.number}</h1>
        </div>
      </animated.div>
      <animated.div
        className={
          "cardFace backFace" + (props.locked === false ? " pointer" : "")
        }
        style={{ opacity: opacity.interpolate((o) => 1 - o), transform }}
        onClick={initiateTurn}
      />
    </div>
  );
};
export default Card;
