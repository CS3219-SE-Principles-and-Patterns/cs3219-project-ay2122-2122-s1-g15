const uri = process.env.MONGO_URI;
const db = require("sharedb-mongo")(uri);
const ShareDB = require("sharedb");
const shareDBServer = new ShareDB({ db });
const connection = shareDBServer.connect();

class EditorService {
  constructor() {}

  create_doc(document_key) {
    console.log("Creating Document " + document_key + " ...");
    ShareDB.types.register(require("rich-text").type);
    const doc = connection.get("documents", document_key);
    if (!doc.type) {
      doc.create([{ insert: "Hello World!" }], "rich-text", (error) => {
        if (error) {
          if (error.code == "ERR_DOC_ALREADY_CREATED") {
            console.log("" + document_key + " is already created! Skipping...");
          } else {
            console.error(error);
          }
        } else {
          console.log("" + document_key + " created!");
        }
      });
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
