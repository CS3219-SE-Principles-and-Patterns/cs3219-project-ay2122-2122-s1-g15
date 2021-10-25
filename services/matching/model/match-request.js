const MATCH_DURATION = process.env.MATCH_DURATION || 60;
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  user: { type: Object, required: true },
  requestId: { type: String, required: true },
  difficulty: { type: String, required: true },
  matchFound: { type: Boolean, default: false },
  createdAt: { type: Date, expires: 200, default: Date.now },
});

schema.static("findMatch", function (difficulty, userRequest) {
  var requestId = userRequest.requestId;
  var userId = userRequest.user.userId;
  var update = { matchFound: true };
  var dt = new Date()
  return this.findOneAndUpdate(
    {
      difficulty,
      requestId: { $ne: requestId },
      "user.userId": {$ne: userId},
      matchFound: false,
      createdAt: {
        $lte: dt,
        $gte: new Date(dt.getTime() - MATCH_DURATION * 1000)
      }
    },
    update
  ).exec();
});

const MatchRequest = mongoose.model("MatchRequest", schema);

module.exports = MatchRequest;
