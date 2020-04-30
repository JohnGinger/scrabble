const getLetters = () => {
  const tiles = [];
  // 2 blank tiles (scoring 0 points)
  repeatTile(tiles, "_", 0, 2);
  // 1 point: E ×12, A ×9, I ×9, O ×8, N ×6, R ×6, T ×6, L ×4, S ×4, U ×4
  repeatTile(tiles, "E", 1, 12);
  repeatTile(tiles, "A", 1, 9);
  repeatTile(tiles, "I", 1, 9);
  repeatTile(tiles, "O", 1, 8);
  repeatTile(tiles, "N", 1, 6);
  repeatTile(tiles, "R", 1, 6);
  repeatTile(tiles, "T", 1, 6);
  repeatTile(tiles, "L", 1, 4);
  repeatTile(tiles, "S", 1, 4);
  repeatTile(tiles, "U", 1, 4);
  // 2 points: D ×4, G ×3
  repeatTile(tiles, "D", 2, 4);
  repeatTile(tiles, "G", 2, 3);
  // 3 points: B ×2, C ×2, M ×2, P ×2
  repeatTile(tiles, "B", 3, 2);
  repeatTile(tiles, "C", 3, 2);
  repeatTile(tiles, "M", 3, 2);
  repeatTile(tiles, "P", 3, 2);
  // 4 points: F ×2, H ×2, V ×2, W ×2, Y ×2
  repeatTile(tiles, "F", 4, 2);
  repeatTile(tiles, "H", 4, 2);
  repeatTile(tiles, "V", 4, 2);
  repeatTile(tiles, "W", 4, 2);
  repeatTile(tiles, "Y", 4, 2);
  // 5 points: K ×1
  repeatTile(tiles, "K", 5, 1);
  // 8 points: J ×1, X ×1
  repeatTile(tiles, "J", 8, 1);
  repeatTile(tiles, "X", 8, 1);
  // 10 points: Q ×1, Z ×1
  repeatTile(tiles, "Q", 10, 1);
  repeatTile(tiles, "Z", 10, 1);
  return shuffle(tiles);
};

export { getLetters };

const repeatTile = (tiles, letter, score, amount) => {
  new Array(amount).fill(0).forEach(() => {
    tiles.push({ letter, score });
  });
};
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
