import React, { createContext } from "react";
import app from "firebase/app";

const FirebaseContext = createContext(null);
export { FirebaseContext };

const FirebaseProvider = ({ children }) => {

  if (!app.apps.length) {
    app.initializeApp({
      apiKey: "AIzaSyAPO4UH816CAfq7Dt8Fb8RTOFAlRXsv4Lg",
      authDomain: "scrabble-66305.firebaseapp.com",
      databaseURL: "https://scrabble-66305.firebaseio.com",
      projectId: "scrabble-66305",
      storageBucket: "scrabble-66305.appspot.com",
      messagingSenderId: "1025831338457",
      appId: "1:1025831338457:web:e16c2e52289504f54419c8",
    });
  }

  return (
    <FirebaseContext.Provider value={app}>{children}</FirebaseContext.Provider>
  );
};
export { FirebaseProvider };
