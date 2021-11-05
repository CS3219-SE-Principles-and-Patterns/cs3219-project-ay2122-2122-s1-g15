var express = require("express");
var router = express.Router();
var controller = require("./controller");
var validation = require("./validation")

// standard health check
router.get("/health", (req, res) => {
  res.status(200).send("ok");
});

router.post("/match/submit", validation.matchSubmit, (req, res) => {
  controller.handleSubmitMatchRequest(req, res);
});

router.put("/match/cancel", 
validation.matchCancel, (req, res) => {
  controller.handleMatchCancel(req, res);
});

router.put("/match/find", validation.matchFind, (req, res) => {
  controller.handleFindMatch(req, res);
})

module.exports = router;
