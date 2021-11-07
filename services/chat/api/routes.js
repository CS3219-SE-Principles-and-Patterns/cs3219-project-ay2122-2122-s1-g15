const express = require("express");
const router = express.Router();

// standard health check
router.get("/", (req, res) => {
  res.status(200).send("ok");
});

module.exports = router;
