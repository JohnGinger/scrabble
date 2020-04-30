writeGameData = (gameId) => {
  firebase.database().ref(`/${gameId}`).set(this.state);
  console.log("DATA SAVED");
};

getGameData = (gameId) => {
  let ref = Firebase.database().ref("/");
  ref.on("value", (snapshot) => {
    const state = snapshot.val();
    this.setState(state);
  });
  console.log("DATA RETRIEVED");
};
export default firebase;
