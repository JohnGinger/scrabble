import {
  SPECIAL_TILES,
  getSpecialTileLocation,
  LETTER_BONUSES,
  WORD_BONUSES,
} from "./constants";
export default ({ tilesBeingUsed, tiles }) => {
  console.log("Get the score for ", tilesBeingUsed, tiles);
  let score = 0;

  const bonusesTouched = tilesBeingUsed
    .map(({ x, y }) => getSpecialTileLocation({ x, y }))
    .filter((location) => {
      SPECIAL_TILES[location];
    });

  const words = getWords({ tiles, tilesBeingUsed });

  for (let word of words) {
    console.log(`Created word ${word.map((x) => x.letter).join("")}`);
    const wordScore = word
      .map((tile) => tile.score * getLetterBonus({ bonusesTouched, ...tile }))
      .reduce((b, a) => a + b, 0);

    const wordBonus = word
      .map((tile) => getWordBonus({ bonusesTouched, ...tile }))
      .reduce((b, a) => a * b, 1);

    console.log(`Word scores ${wordScore} `);
    if (wordBonus > 1) {
      console.log(`with a bonus of x${wordBonus}`);
    }

    console.log(`Total score is ${wordScore * wordBonus}`);

    score += wordScore * wordBonus;
  }
  console.log(`Score for turn is ${score}`);
  return score;
};

const getLetterBonus = ({ bonusesTouched, x, y }) => {
  const loc = getSpecialTileLocation({ x, y });
  if (bonusesTouched.includes(loc)) {
    return LETTER_BONUSES[SPECIAL_TILES[loc]];
  } else {
    return 1;
  }
};

const getWordBonus = ({ bonusesTouched, x, y }) => {
  const loc = getSpecialTileLocation({ x, y });
  if (bonusesTouched.includes(loc)) {
    return WORD_BONUSES[SPECIAL_TILES[loc]];
  } else {
    return 1;
  }
};

const getWords = ({ tiles, tilesBeingUsed }) => {
  let words = [tilesBeingUsed];

  getMainWord({tiles, tilesBeingUsed})

  for (let tile of tilesBeingUsed) {
    const { x, y } = tile;
    if (!isWordTile({ x, y: y - 1, tilesBeingUsed })) {
      words = [
        ...words,
        getSurroundingWords({ tiles, x, y, xDirection: 0, yDirection: -1 }),
      ];
    }
    if (!isWordTile({ x, y: y + 1, tilesBeingUsed })) {
      words = [
        ...words,
        getSurroundingWords({ tiles, x, y, xDirection: 0, yDirection: +1 }),
      ];
    }
    if (!isWordTile({ x: x - 1, y, tilesBeingUsed })) {
      words = [
        ...words,
        getSurroundingWords({ tiles, x, y, xDirection: -1, yDirection: 0 }),
      ];
    }
    if (!isWordTile({ x: x + 1, y, tilesBeingUsed })) {
      words = [
        ...words,
        getSurroundingWords({ tiles, x, y, xDirection: +1, yDirection: 0 }),
      ];
    }
  }
  return words.filter((x) => x.length > 1);
};

const isWordTile = ({ x, y, tilesBeingUsed }) => {
  return tilesBeingUsed.some((tile) => tile.x == x && tile.y == y);
};

const getSurroundingWords = ({
  tiles,
  x: startX,
  y: startY,
  xDirection,
  yDirection,
}) => {
  let x = startX;
  let y = startY;
  let word = [];
  let tile = tiles[x][y];

  while (tile && tile.letter !== "") {
    word = [...word, tile];
    x += xDirection;
    y += yDirection;
    tile = { ...tiles[x][y], x, y };
  }
  return word;
};
