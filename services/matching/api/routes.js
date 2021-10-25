var express = require("express");
var router = express.Router();
var controller = require("./controller");

// standard health check
router.get("/health", (req, res) => {
  res.status(200).send("ok");
});

router.post("/match/submit", (req, res) => {
  controller.handleSubmitMatchRequest(req, res);
});

module.exports = router;
