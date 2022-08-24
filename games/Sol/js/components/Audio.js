import React, { useContext, useEffect } from "react";
import GameContext from "../context/GameContext";

const Audio = () => {
  const context = useContext(GameContext);

  useEffect(() => {
    let tracks = [
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
    ];
    let audioEl = document.getElementById("audio-element");
    audioEl.pause();
    audioEl.currentTime = 0;
    audioEl.src = tracks[context.state.options.track];
    audioEl.play().catch((e) => e);
  }, []);

  return (
    <>
      <audio id="audio-element">
        <source src=""></source>
      </audio>
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
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    </>
  );
};

export default Audio;
