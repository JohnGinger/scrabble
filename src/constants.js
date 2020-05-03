const SPECIAL_TILES = {
  "0-0": "center",
  "1-1": "double-letter",
  "2-2": "triple-letter",
  "3-3": "double-word",
  "4-4": "double-word",
  "5-5": "double-word",
  "6-6": "double-word",
  "7-7": "triple-word",
  "0-4": "double-letter",
  "0-7": "triple-word",
  "1-5": "double-letter",
  "2-6": "triple-letter",
  "4-7": "double-letter",
  "7-4": "double-letter",
  "6-2": "triple-letter",
  "5-1": "double-letter",
  "7-0": "triple-word",
  "4-0": "double-letter",
};

export { SPECIAL_TILES };

const getSpecialTileLocation = ({ x, y }) =>
  `${Math.abs(x - 7)}-${Math.abs(y - 7)}`;

export { getSpecialTileLocation };

const LETTER_BONUSES = {
  "double-letter": 2,
  "triple-letter": 3,
};
export { LETTER_BONUSES };

const WORD_BONUSES = {
  "double-word": 2,
  "triple-word": 3,
};
export { WORD_BONUSES };
