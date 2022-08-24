import React, { useContext } from "react";
import GameContext from "../context/GameContext";
const ScoreComp = () => {
  let context = useContext(GameContext);
  let score = context.state.options;
  return (
    <div className="score">
      Score: <span>{score.score}</span>
    </div>
  );
};
export default ScoreComp;
