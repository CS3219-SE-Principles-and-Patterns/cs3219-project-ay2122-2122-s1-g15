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
  return this.aggregate([{$match: {difficulty}}, { $sample: { size: 1 } }])
  .then(lst => {
    if (lst.length > 0) {
      return lst[0]
    } else {
      return null
    }
  })
});

const Question = mongoose.model("Question", schema);

module.exports = Question;
