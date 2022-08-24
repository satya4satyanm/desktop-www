import React, { useEffect, useContext } from "react";
import GameContext from "../context/GameContext";

const msToTime = (duration) => {
  var seconds = Math.floor(duration % 60),
    minutes = Math.floor((duration / 60) % 60),
    hours = Math.floor((duration / (60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
};

const Timer = () => {
  const context = useContext(GameContext);
  // https://upmostly.com/tutorials/build-a-react-timer-component-using-hooks
  let seconds = context.state.options.time;
  const isActive = context.state.options.timerActive;

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        seconds++;
        context.dispatch({
          type: "TIME",
          time: seconds
        });
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [seconds, isActive]);

  return (
    <span className="timer">
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
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span className="txt"> {msToTime(seconds)}</span>
    </span>
  );
};

export default Timer;
