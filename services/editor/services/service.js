const uri = process.env.MONGO_URI || "mongodb+srv://atlas_admin:KEwpeOZbjbfrWIOQ@nodejs-reviews.0ekmm.mongodb.net/connection?retryWrites=true&w=majority";
const db = require('sharedb-mongo')(uri);
const ShareDB = require("sharedb");
const shareDBServer = new ShareDB({db});
const connection = shareDBServer.connect();

class EditorService {
  constructor() {}

  create_doc(document_key) {
    console.log("Starting server....");
    ShareDB.types.register(require("rich-text").type);
    const doc = connection.get("documents", document_key);
    if (!doc.type) {
      doc.create([{ insert: "Hello World!" }], "rich-text", (error) => {
        if (error) console.error(error)
      })
    }
  }

  remove_document(document_key) {
    const doc = connection.get("documents", document_key);
    doc.del(function (err) {
      if (err) {
        throw err;
      }
    });
    doc.destroy(function (err) {
      if (err) {
        throw err;
      }
    });
  }
}

let editorService = new EditorService();
module.exports = editorService;
