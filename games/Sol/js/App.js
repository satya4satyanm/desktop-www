import React, { useEffect, useReducer } from "react";
import {
  foundationReducer,
  stockReducer,
  tableauReducer,
  optionsReducer
} from "./reducers/Reducer";

import Game from "./components/Game";
import Store from "./store/Store";
import GameContext from "./context/GameContext";
import combineReducers from "react-combine-reducers";
import useLocalStorage from "react-use-localstorage";

import "./styles.css";

export default function App() {
  let [lsData, setLsData] = useLocalStorage(
    "lsData",
    JSON.stringify(Store.initialState)
  );

  let parsedLSD = JSON.parse(lsData);

  const [rootReducer, initialState] = combineReducers({
    stock: [stockReducer, parsedLSD.stock],
    foundation: [foundationReducer, parsedLSD.foundation],
    tableau: [tableauReducer, parsedLSD.tableau],
    options: [optionsReducer, parsedLSD.options]
  });

  let [state, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    setLsData(JSON.stringify(state));
  }, [state, setLsData]);

  return (
    <div className="App">
      <GameContext.Provider
        value={{
          initialState: Store.initialState,
          state,
          dispatch,
          cards: Store.cards
        }}
      >
        <Game />
      </GameContext.Provider>
    </div>
  );
}
