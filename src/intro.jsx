import React, { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "./firebase";
import "firebase/database";

require("./intro.scss");

export default ({ name, setName, setGame }) => (
  <intro-block>
    <h2>Welcome</h2>
    <h1>Lets play scrabble</h1>
    <JoinGame name={name} setName={setName} setGame={setGame} />
  </intro-block>
);

const JoinGame = ({ name, setName, setGame }) => {
  const [gameId, setGameId] = useState("");

  const firebase = useContext(FirebaseContext);

  const addGame = () => {
    const gameRef = firebase.database().ref(`/${gameId}/players`);

    gameRef.push({ name }).then(() => {
      setGame(gameId);
    });
  };

  return (
    <>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <input
        type="text"
        placeholder="Enter the game code"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      ></input>
      <button onClick={() => addGame()}>Play!</button>
    </>
  );
};
