const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  difficulty: {
    type: String,
    required: true,
  },
  questionId: {
    type: ObjectId,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Session = mongoose.model("Session", schema);

module.exports = Session;
