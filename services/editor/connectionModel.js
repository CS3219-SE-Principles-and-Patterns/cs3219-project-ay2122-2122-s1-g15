var mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);
// Setup schema
var connectionSchema = mongoose.Schema(
  {
    _id: Number,
    port: Number,
    session_id: Number,
    document_key: {
      type: String,
      required: true,
    },
    create_date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);
// Export connection model
connectionSchema.plugin(AutoIncrement);
var Connection = (module.exports = mongoose.model(
  "connection",
  connectionSchema
));

module.exports.get_all_connections = function (callback, limit) {
  Connection.find(callback).limit(limit);
};
