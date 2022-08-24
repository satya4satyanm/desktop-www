import React, { useContext } from "react";
import GameContext from "../context/GameContext";

const Modal = (props) => {
  let context = useContext(GameContext);
  const onRadioChange1 = (e) => {
    context.dispatch({ type: "CARDS", cards: Number(e.target.value) });
  };
  // const onRadioChange2 = (e) => {
  //   context.dispatch({ type: "CLICK_PLAY", clickPlay: e.target.value });
  // };
  // const onRadioChange3 = (e) => {
  //   context.dispatch({ type: "AUTO_PLAY", autoPlay: e.target.value });
  // };

  const onRadioChange4 = (e) => {
    context.dispatch({ type: "AUDIO", track: e.target.value });
  };

  const setBg = (bg) => {
    context.dispatch({ type: "BG_IMG", bgImg: bg });
    document.querySelector("html").setAttribute("class", bg);
  };

  return (
    <div className="modal">
      <div className="modal">
        {props.options && (
          <div
            className="close apply"
            onClick={() => {
              props.onClick();
              context.dispatch({
                type: "TIMER_ACTIVE",
                timerActive: true
              });
            }}
          >
            <svg fill="#ffffff" width="24" height="24" viewBox="0 0 24 24">
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
          </div>
        )}
        {!props.options && (
          <div
            className="close cancel"
            onClick={() => {
              props.onClick();
              context.dispatch({
                type: "TIMER_ACTIVE",
                timerActive: true
              });
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="css-i6dzq1"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        )}
        {props.options && (
          <>
            <h2>Options</h2>
            <div className="content">
              <p>Draw card(s) at once</p>
              <p className="b">
                <input
                  type="radio"
                  name="radiog_lite1"
                  id="radio1"
                  className="css-checkbox"
                  value="1"
                  checked={context.state.options.cards === 1}
                  onChange={onRadioChange1}
                />
                <label htmlFor="radio1" className="css-label radGroup1">
                  One - 1
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="radio"
                  name="radiog_lite1"
                  id="radio2"
                  className="css-checkbox"
                  value="3"
                  checked={context.state.options.cards === 3}
                  onChange={onRadioChange1}
                />
                <label htmlFor="radio2" className="css-label radGroup1">
                  Three - 3
                </label>
              </p>

              <p>Audio</p>
              <p className="b">
                <input
                  type="radio"
                  name="radiog_lite7"
                  id="radio7"
                  className="css-checkbox"
                  value="0"
                  checked={context.state.options.track === "0"}
                  onChange={onRadioChange4}
                />
                <label htmlFor="radio7" className="css-label radGroup4">
                  Track 1
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="radio"
                  name="radiog_lite8"
                  id="radio8"
                  className="css-checkbox"
                  value="1"
                  checked={context.state.options.track === "1"}
                  onChange={onRadioChange4}
                />
                <label htmlFor="radio8" className="css-label radGroup4">
                  Track 2
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="radio"
                  name="radiog_lite9"
                  id="radio9"
                  className="css-checkbox"
                  value="2"
                  checked={context.state.options.track === "2"}
                  onChange={onRadioChange4}
                />
                <label htmlFor="radio9" className="css-label radGroup4">
                  Track 3
                </label>
              </p>

              {/* <p>Click to play</p>
              <p className="b">
                <input
                  type="radio"
                  name="radiog_lite2"
                  id="radio3"
                  className="css-checkbox"
                  value="on"
                  checked={context.state.options.clickPlay === "on"}
                  onChange={onRadioChange2}
                />
                <label htmlFor="radio3" className="css-label radGroup2">
                  On
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="radio"
                  name="radiog_lite2"
                  id="radio4"
                  className="css-checkbox"
                  value="off"
                  checked={context.state.options.clickPlay === "off"}
                  onChange={onRadioChange2}
                />
                <label htmlFor="radio4" className="css-label radGroup2">
                  Off
                </label>
              </p>

              <p>Autoplay</p>
              <p className="b">
                <input
                  type="radio"
                  name="radiog_lite3"
                  id="radio5"
                  className="css-checkbox"
                  value="on"
                  checked={context.state.options.autoPlay === "on"}
                  onChange={onRadioChange3}
                />
                <label htmlFor="radio5" className="css-label radGroup3">
                  Valid Moves
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="radio"
                  name="radiog_lite3"
                  id="radio6"
                  className="css-checkbox"
                  value="off"
                  checked={context.state.options.autoPlay === "off"}
                  onChange={onRadioChange3}
                />
                <label htmlFor="radio6" className="css-label radGroup3">
                  Never
                </label>
              </p> */}

              <p>Background Image</p>
              <p className="b">
                <span
                  className="blank-img"
                  onClick={() => {
                    setBg("");
                  }}
                >
                  None
                </span>
                <span
                  className="blank-img bg0"
                  onClick={() => {
                    setBg("bg0");
                  }}
                ></span>
                <span
                  className="blank-img bg1"
                  onClick={() => {
                    setBg("bg1");
                  }}
                ></span>
                <span
                  className="blank-img bg2"
                  onClick={() => {
                    setBg("bg2");
                  }}
                ></span>
                <span
                  className="blank-img bg3"
                  onClick={() => {
                    setBg("bg3");
                  }}
                ></span>
              </p>
            </div>
          </>
        )}
        {!props.options && (
          <>
            <h2>Klondike Solitaire</h2>
            <div className="content">
              <p>Game Rules</p>
              <br />
              <p>Card reveal in piles gives 5 points</p>
              <p>Card moved from deck to piles 5 points</p>
              <p>Card moved from deck to stack 10 points</p>
              <p>Card moved from stack to piles -15 points</p>
              <br />
              <h3>Happy Playing!</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
