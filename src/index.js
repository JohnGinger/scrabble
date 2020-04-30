import React, { useState } from "react";
var ReactDOM = require("react-dom");
import { FirebaseProvider } from "./firebase";
import { useSearchParam } from "react-use";
require("./index.scss");

import Intro from "./intro";
import GameAndLobby from "./GameAndLobby";

const App = () => {
  const [game, setGame] = useState(useSearchParam("game"));
  const [name, setName] = useState(useSearchParam("name"));

  if (game) {
    return <GameAndLobby gameId={game} name={name} />;
  }

  return <Intro name={name} setName={setName} setGame={setGame} />;
};

const appDom = document.getElementById("app");

ReactDOM.render(
  <FirebaseProvider>
    <App />,
  </FirebaseProvider>,
  appDom
);
