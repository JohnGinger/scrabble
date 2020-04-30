import React from "react";
import { getLetters } from "./getLetters";

const Lobby = ({ gameState, gameRef }) => {
  const startGame = () => {
    const gameLetters = getLetters();
    const playerOrder = Object.keys(gameState.players);
    let lettersRemovedFromBag = 0;
    let players = gameState.players;
    for (let playerId of playerOrder) {
      players[playerId].tiles = gameLetters.slice(
        lettersRemovedFromBag,
        lettersRemovedFromBag + 7
      );
      lettersRemovedFromBag += 7;
    }

    gameRef.update({
      active: true,
      letters: getLetters(),
      lettersRemovedFromBag,
      playerOrder,
      players,
      currentPlayer: 0,
      tiles: new Array(15)
        .fill("")
        .map((x) => new Array(15).fill("").map((x) => ({ letter: "" }))),
    });
  };

  if (!gameState.players) {
    return <players-list> No players yet </players-list>;
  }

  return (
    <players-list>
      <h2>Waiting to play</h2>
      {Object.values(gameState.players).map((player) => (
        <player-name key={player.name}>{player.name}</player-name>
      ))}
      <button onClick={() => startGame()}>Start Game</button>
    </players-list>
  );
};

export default Lobby;
