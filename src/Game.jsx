import React, { useState, useContext, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { SPECIAL_TILES, getSpecialTileLocation } from "./constants";
import scoreMove from "./scoreMove";

const getValidTiles = ({ players, tilesBeingUsed, name }) => {
  console.log("calculating valid tiles");
  if (!players) {
    return [];
  }
  let player = Object.values(players).find((x) => x.name === name);

  if (!player) {
    return [];
  }
  let validTiles = player.tiles || [];

  for (let usedTile of tilesBeingUsed) {
    const index = validTiles.findIndex(
      (validTile) => validTile.letter == usedTile.letter
    );
    if (index > -1) {
      validTiles.splice(index, 1);
    }
  }
  return validTiles;
};

const Game = ({ gameState, gameRef, name }) => {
  const currentPlayerId = gameState.playerOrder[gameState.currentPlayer];
  const currentPlayer = gameState.players[currentPlayerId];
  const yourTurn = currentPlayer.name === name;

  const [tilesBeingUsed, setTilesBeingUsed] = useState([]);
  const [validTiles, setValidTiles] = useState([]);
  const [askedToRun, setAskedToRun] = useState(false);
  let timeoutRef;

  useEffect(() => {
    if (gameState.challenged && gameState.challenged != "") {
      console.log("challenged!");
      setAskedToRun(false);
      setTimeout(() => {
        gameRef.update({
          challenged: "",
        });
      }, 2000);
      clearTimeout(timeoutRef);
    }
  }, [gameState]);

  useEffect(() => {
    if (askedToRun) {
      console.log("ask for challenge");

      timeoutRef = setTimeout(() => {
        console.log("end turn");

        gameRef.update({
          askForChallenge: false,
        });
        endTurn({
          tilesBeingUsed,
          setTilesBeingUsed,
          validTiles,
          gameRef,
          gameState,
          currentPlayerId,
        });
        setAskedToRun(false);
      }, 5000);
      gameRef.update({
        askForChallenge: true,
        challenged: "",
      });
    }
    return () => clearTimeout(timeoutRef);
  }, [askedToRun]);

  useEffect(() => {
    const validTiles = getValidTiles({
      players: gameState.players,
      tilesBeingUsed,
      name,
    });
    console.log("Valid tiles are", validTiles);
    setValidTiles(validTiles);
  }, [tilesBeingUsed, gameState]);

  const removeFromUsedTiles = (tile, x, y) => {
    console.log("removing", tile, x, y);
    let newTilesBeingUsed = tilesBeingUsed;
    for (let tileBeingUsed of tilesBeingUsed) {
      const index = tilesBeingUsed.findIndex(
        (used) => used.letter == tile.letter && used.x == x && used.y == y
      );
      if (index !== -1) {
        newTilesBeingUsed.splice(index, 1);
      }
    }
    console.log(newTilesBeingUsed);
    setTilesBeingUsed(newTilesBeingUsed);
  };

  const addToUsedTiles = (tile, x, y) => {
    const newUsedTiles = [...tilesBeingUsed, { ...tile, x, y }];
    console.log(newUsedTiles);
    setTilesBeingUsed(newUsedTiles);
  };

  const isTilePlacedBefore = ({ x, y }) => {
    return (
      gameState.tiles[x][y].letter !== "" &&
      !tilesBeingUsed.some((tile) => tile.x == x && tile.y == y)
    );
  };

  const getTileValue = ({ x, y }) => {
    return gameState.tiles[x][y];
  };

  const setTile = ({ x, y, letter }) => {
    console.log(x, y, letter);
    letter = letter.toUpperCase();
    if (!yourTurn) {
      return;
    }
    const tilePlacedPreviousTurn = isTilePlacedBefore({ x, y });
    if (tilePlacedPreviousTurn) {
      return;
    }
    const oldTile = getTileValue({ x, y });

    const isDelete = letter == "";
    if (isDelete) {
      updateGameStateTile({ x, y, tile: { letter: "" } });
      removeFromUsedTiles(oldTile, x, y);
    }
    const validLetter = validTiles.find(
      (validTile) => validTile.letter === letter
    );
    if (!validLetter) {
      return;
    }
    const isReplace = oldTile !== { letter: "" };
    if (isReplace) {
      removeFromUsedTiles(oldTile, x, y);
    }
    updateGameStateTile({ x, y, tile: validLetter });
    addToUsedTiles(validLetter, x, y);
  };

  const updateGameStateTile = ({ x, y, tile }) => {
    const newTiles = gameState.tiles;
    console.log("here");
    newTiles[x][y] = { ...tile, active: true };
    console.log(newTiles[x][y]);
    gameRef.update({
      tiles: newTiles,
    });
  };

  return (
    <board-container>
      <h1>
        Current player is {currentPlayer.name} {yourTurn && "(Your turn)"}
        {}
      </h1>
      <h2>
        {gameState.letters.length - gameState.lettersRemovedFromBag} letters
        remaining
      </h2>
      <h2>{gameState.challenged && `Challenged by ${gameState.challenged}`}</h2>
      {new Array(15).fill("").map((_, y) => (
        <BoardRow
          y={y}
          key={y}
          tiles={gameState.tiles}
          setTile={setTile}
          isTilePlacedBefore={isTilePlacedBefore}
        />
      ))}
      <tile-board>
        <h2>Your tiles</h2>
        <list-of-tiles>
          {validTiles.map((letter, i) => (
            <Tile letter={letter} key={i} />
          ))}
        </list-of-tiles>
      </tile-board>
      {yourTurn && !askedToRun && (
        <button onClick={() => setAskedToRun(true)}>End Turn</button>
      )}
      {!yourTurn && gameState.askForChallenge && (
        <>
          <button
            onClick={() =>
              gameRef.update({
                askForChallenge: false,
                challenged: name,
              })
            }
          >
            Challenge!{" "}
            <CountdownCircleTimer
              isPlaying={true}
              duration={5}
              colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </button>
        </>
      )}
      {/* TODO <Scores players={gameState.players} /> */}
    </board-container>
  );
};
export default Game;

const Scores = ({ players }) => {
  return (
    <scores-container>
      <h1>Player Scores</h1>
      {Object.values(players).map((player) => (
        <player-container key={player.name}>
          <player-name>{player.name}</player-name>
          <player-score>{player.score}</player-score>
        </player-container>
      ))}
    </scores-container>
  );
};

const GameSquare = ({ x, y, tiles, setTile, isTilePlacedBefore }) => {
  const tileOnSquare = tiles[x][y];
  if (!isTilePlacedBefore({ x, y }) || tileOnSquare.letter == "") {
    return (
      <game-square class={getTileClass({ x, y })}>
        <input
          value={tileOnSquare.letter}
          className={tileOnSquare.letter != "" ? "filled" : ""}
          onChange={(e) => setTile({ x, y, letter: e.target.value })}
        ></input>
      </game-square>
    );
  } else {
    return (
      <game-square class={getTileClass({ x, y })}>
        <Tile
          letter={tileOnSquare}
          className={tileOnSquare.active ? "active" : ""}
        />
      </game-square>
    );
  }
};

const getTileClass = ({ x, y }) => {
  const location = getSpecialTileLocation({ x, y });
  if (SPECIAL_TILES[location]) {
    return SPECIAL_TILES[location];
  }
  return "";
};

const BoardRow = ({ y, tiles, setTile, isTilePlacedBefore }) => {
  return (
    <board-row>
      {new Array(15).fill("").map((_, x) => (
        <GameSquare
          x={x}
          y={y}
          key={`${x}-${y}`}
          tiles={tiles}
          setTile={setTile}
          isTilePlacedBefore={isTilePlacedBefore}
        />
      ))}
    </board-row>
  );
};

const Tile = ({ letter, className }) => {
  return (
    <tile-container class={className}>
      <tile-letter>{letter.letter}</tile-letter>
      <tile-score>{letter.score}</tile-score>
    </tile-container>
  );
};

const endTurn = ({
  tilesBeingUsed,
  setTilesBeingUsed,
  validTiles,
  gameRef,
  gameState,
  currentPlayerId,
}) => {
  let numNewTiles;
  if (tilesBeingUsed.length == 0) {
    numNewTiles = 1;
  } else {
    numNewTiles = 7 - validTiles.length;
  }

  let lettersRemovedFromBag = gameState.lettersRemovedFromBag;
  const lettersRemaining = 100 - lettersRemovedFromBag;
  numNewTiles = Math.min(lettersRemaining, numNewTiles);
  const newTiles = gameState.letters.slice(
    lettersRemovedFromBag,
    lettersRemovedFromBag + numNewTiles
  );
  lettersRemovedFromBag += numNewTiles;
  let players = gameState.players;

  players[currentPlayerId].tiles = [...validTiles, ...newTiles];

  // TODO add scoring
  // players[currentPlayerId].score += scoreMove({
  //   tilesBeingUsed,
  //   tiles: gameState.tiles,
  // });
  setTilesBeingUsed([]);
  const boardTiles = gameState.tiles.map((row) =>
    row.map((tile) => ({ ...tile, active: false }))
  );
  gameRef.update({
    currentPlayer: (gameState.currentPlayer + 1) % gameState.playerOrder.length,
    lettersRemovedFromBag,
    tiles: boardTiles,
    players,
  });
};
