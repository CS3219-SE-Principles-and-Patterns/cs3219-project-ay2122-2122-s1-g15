const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  userId: { type: String, required: true },
  requestId: { type: String, required: true },
  difficulty: { type: String, required: true },
  matchFound: { type: Boolean, default: false },
  createdAt: { type: Date, expires: 3600, default: Date.now },
});

schema.static("findMatch", function (difficulty, userId, requestId) {
  return this.findOne({
    difficulty,
    requestId: { $ne: requestId },
    userId: { $ne: userId },
    matchFound: false,
  }).exec();
});

const MatchRequest = mongoose.model("MatchRequest", schema);

module.exports = MatchRequest;
