import React, { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "./firebase";
import "firebase/database";
import Lobby from "./Lobby";
import Game from "./Game";
require("./game.scss");

export default ({ gameId, name }) => {
  const firebase = useContext(FirebaseContext);
  const [gameState, setGameState] = useState({});
  const [gameRef, setGameRef] = useState();

  window.gameState = gameState;
  useEffect(() => {
    var gameRef = firebase.database().ref(`/${gameId}/`);
    setGameRef(gameRef);
    gameRef.on("value", function (snapshot) {
      setGameState(snapshot.val());
    });
  }, []);
  return (
    <game-container>
      <game-title>
        Game Id - {gameId} - playing as {name} <a href="/">New Game</a>
      </game-title>
      {gameState.active ? (
        <Game gameState={gameState} gameRef={gameRef} name={name} />
      ) : (
        <Lobby gameState={gameState} gameRef={gameRef} />
      )}
    </game-container>
  );
};
