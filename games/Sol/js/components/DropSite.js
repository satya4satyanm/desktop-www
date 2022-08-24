import React, { useContext } from "react";
import { consts } from "../constants/Constants";
import GameContext from "../context/GameContext";

const DropSite = (props) => {
  let context = useContext(GameContext);
  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drop(ev) {
    ev.preventDefault();
    let data = JSON.parse(ev.dataTransfer.getData("text"));
    // debugger;
    // props.drop(data.suit, data.number);
    context.dispatch({
      type: "DRAG_END"
    });
    context.dispatch({
      type: "DROP",
      targetPileType: props.pileType,
      targetPileIndex: props.pileIndex,
      suit: data.suit,
      number: data.number
    });
    if (
      !data.oc &&
      data.prevCardTurned === false &&
      data.df === "t" &&
      props.pileType === consts.TABLEAU
    ) {
      context.dispatch({
        type: "ADD",
        score: 5
      });
    }
    if (data.df === "f" && props.pileType === consts.TABLEAU) {
      context.dispatch({
        type: "ADD",
        score: -15
      });
    }
    if (data.df === "t" && props.pileType === consts.FOUNDATION) {
      context.dispatch({
        type: "ADD",
        score: 10
      });
    }
    if (data.df === "s" && props.pileType === consts.FOUNDATION) {
      context.dispatch({
        type: "ADD",
        score: 10
      });
    }
    if (data.df === "s" && props.pileType === consts.TABLEAU) {
      context.dispatch({
        type: "ADD",
        score: 5
      });
    }
  }

  return (
    <div
      className="dropTarget"
      style={{ visibility: props.visible ? "visible" : "hidden" }}
      onDrop={drop}
      onDragOver={allowDrop}
    >
      <h1>+</h1>
    </div>
  );
};
export default DropSite;
