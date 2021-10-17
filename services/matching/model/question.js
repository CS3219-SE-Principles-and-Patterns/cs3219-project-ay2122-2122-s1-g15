const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  difficulty: {
    type: String,
    required: true,
  },
  markdown: {
    type: String,
    required: true,
  },
});

schema.static("fetchRandomQuestion", function (difficulty) {
  var count = this.count();
  // Get a random entry
  var random = Math.floor(Math.random() * count);
  return this.findOne({ difficulty }).skip(random).exec();
});

const Question = mongoose.model("Question", schema);

module.exports = Question;
