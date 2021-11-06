const {
  DIFFICULTY,
  HEADER_KEYS,
  HEADER_VALS,
} = require("../constants/constants");
const { body} = require("express-validator");

module.exports = {
  matchSubmit: [
    body("user").exists(),
    body("difficulty").exists(),
    body("difficulty").isIn([
      DIFFICULTY.EASY,
      DIFFICULTY.MEDIUM,
      DIFFICULTY.HARD,
    ]),
  ],

  matchCancel: [
    body("requestId").exists(),
    body("requestId").isString(),
    body("requestId").isLength(36)
  ],

  matchFind: [
    body("requestId").exists(),
    body("requestId").isString(),
    body("requestId").isLength(36)
  ]


};