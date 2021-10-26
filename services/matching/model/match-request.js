const MATCH_DURATION = process.env.MATCH_DURATION || 60;
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  user: { type: Object, required: true },
  requestId: { type: String, required: true },
  difficulty: { type: String, required: true },
  match: {type: mongoose.Schema.Types.ObjectId, default: null },
  sessionInfo: {type : Object, default: null},
  createdAt: { type: Date, expires: 3600, default: Date.now },
});

schema.static("findUser", function (requestId) {
  return this.findOne({
    requestId
  }).exec()
})

schema.static("findMatch", function ( userRequest) {
  var requestId = userRequest.requestId;
  var email = userRequest.user.email;
  var update = { matchFound: true };
  var difficulty = userRequest.difficulty
  var dt = new Date()
  return this.findOneAndUpdate(
    {
      difficulty,
      requestId: { $ne: requestId },
      "user.email": {$ne: email},
      match: null,
      sessionInfo: null,
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
