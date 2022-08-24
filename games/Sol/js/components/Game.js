import React, { useState, useContext, useEffect } from "react";
// import ReactDOM from 'react-dom';
import ScoreComp from "./ScoreComp";
import Stock from "./Stock";
import Foundation from "./Foundation";
import Tableau from "./Tableau";
import Modal from "./Modal";
import GameContext from "../context/GameContext";
import Timer from "./Timer";
import { generateCards, ginitialState } from "../store/Store";
import Audio from "./Audio";

const Game = () => {
  let [showConfirm, setShowConfirm] = useState(false);
  let context = useContext(GameContext);
  let bg = context.state.options.bgImg;
  document.querySelector("html").setAttribute("class", bg);
  let showCongrats =
    context.state.foundation[0].cards.length === 13 &&
    context.state.foundation[1].cards.length === 13 &&
    context.state.foundation[2].cards.length === 13 &&
    context.state.foundation[3].cards.length === 13;

  let [modalVisible, setModalVisible] = useState({ show: false, opt: false });

  useEffect(() => {
    if (showCongrats) {
      context.dispatch({
        type: "TIMER_ACTIVE",
        timerActive: false
      });
    }
  }, [showCongrats]);

  return (
    <>
      <div id="container">
        <div className="header-bar">
          <div className="header-inner">
            <ScoreComp />
            <span className="moves">Moves: {context.state.options.moves}</span>
            <Timer />
            <div
              className="help"
              onClick={() => {
                setModalVisible({
                  show: true,
                  opt: false
                });
                context.dispatch({
                  type: "TIMER_ACTIVE",
                  timerActive: false
                });
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="css-i6dzq1"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div
              className="options"
              onClick={() => {
                setModalVisible({
                  show: true,
                  opt: true
                });
                context.dispatch({
                  type: "TIMER_ACTIVE",
                  timerActive: false
                });
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="23"
                height="23"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="css-i6dzq1"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <div
              className="music"
              onClick={(e) => {
                context.dispatch({
                  type: "MUSIC",
                  music: !context.state.options.music
                });
              }}
            >
              {context.state.options.music && <Audio />}

              {!context.state.options.music && (
                <svg
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="css-i6dzq1"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              )}
            </div>

            <div
              className="new-game"
              onClick={() => {
                setShowConfirm(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
          </div>
        </div>
        <div className="header">
          <Stock />
          <Foundation />
        </div>
        <Tableau />

        {showConfirm && (
          <div className="confirm">
            <div className="arrow-up"></div>
            <button
              onClick={() => {
                let cards = generateCards();
                let istate = ginitialState(cards);
                context.dispatch({
                  type: "RESET",
                  initialData: istate
                });
                context.dispatch({
                  type: "TIME",
                  time: 0
                });
                context.dispatch({
                  type: "TIMER_ACTIVE",
                  timerActive: true
                });
                setShowConfirm(false);
              }}
            >
              Start New
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
              }}
            >
              Continue
            </button>
          </div>
        )}
        <div className="gname">Klondike Solitaire</div>

        {modalVisible.show && (
          <Modal
            options={modalVisible.opt}
            onClick={() => {
              setModalVisible({
                show: false,
                opt: false
              });
            }}
          />
        )}
      </div>
      <div
        className="congratulation"
        style={{
          visibility: showCongrats ? "visible" : "hidden"
        }}
      >
        <h3>Congratulation, you did it!</h3>
        <h2>You Scored: {context.state.options.score}</h2>
        <h5>In {context.state.options.time} Seconds</h5>
        <div
          className="congb"
          onClick={() => {
            let cards = generateCards();
            let istate = ginitialState(cards);
            context.dispatch({
              type: "RESET",
              initialData: istate
            });
            context.dispatch({
              type: "TIME",
              time: 0
            });
            context.dispatch({
              type: "TIMER_ACTIVE",
              timerActive: true
            });
          }}
        >
          New Game
        </div>
      </div>
    </>
  );
};

export default Game;
