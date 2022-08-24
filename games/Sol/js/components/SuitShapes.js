import React from "react";

export const Heart = ({ zoom = false }) => (
  <svg
    className="suitIcon"
    width="40"
    height="40"
    viewBox="0 0 20 20"
  >
    <path
      className="heart"
      d="
         M 0 6 
         A 2.5 2.5 0 0 1 10 6 
         A 2.5 2.5 0 0 1 20 6
         Q 16 14 10 19
         Q 4 14 0 6"
    />
  </svg>
);

export const Tile = ({ zoom = false }) => (
  <svg
    className="suitIcon"
    width="40"
    height="40"
    viewBox="0 0 20 20"
  >
    <path
      className="tile"
      d="
         M 10 0 
         Q 13 5 17 10 
         Q 13 15 10 20
         Q 7 15 3 10
         Q 7 5 10 0"
    />
  </svg>
);

export const Clover = ({ zoom = false }) => (
  <svg
    className="suitIcon"
    width="40"
    height="40"
    viewBox="0 0 20 20"
  >
    <circle className="clover" cx="10" cy="5" r="4.5" />
    <circle className="clover" cx="5" cy="11" r="4.5" />
    <circle className="clover" cx="15" cy="11" r="4.5" />
    <polygon className="clover" points="10 8, 15 20, 5 20" />
  </svg>
);

export const Pike = ({ zoom = false }) => (
  <svg
    className="suitIcon"
    width="40"
    height="40"
    viewBox="0 0 20 20"
  >
    <path
      className="pike"
      d="
         M 0 12 
         A 2.5 2.5 0 0 0 10 12 
         A 2.5 2.5 0 0 0 20 12
         Q 16 4 10 0
         Q 4 4 0 12"
    />
    <polygon className="pike" points="10 10, 13 20, 7 20" />
  </svg>
);
