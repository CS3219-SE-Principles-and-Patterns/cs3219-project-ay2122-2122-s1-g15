const express = require("express");
const controller = require("./controller");
const router = express.Router();

// code here
router.get("/", controller.example);

module.exports = router;
