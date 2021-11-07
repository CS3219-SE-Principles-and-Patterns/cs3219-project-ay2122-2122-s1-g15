const connectionHandler = require("./db");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const ShareDB = require("sharedb");
const shareDBServer = new ShareDB();
const connection = shareDBServer.connect();
const WSS_PORT = 6100;
const wss = new WebSocket.Server({ port: WSS_PORT });

class EditorService {
  constructor() {
    connectionHandler.connect();
    wss.on("connection", function connection(ws) {
      // For transport we are using a ws JSON stream for communication
      // that can read and write js objects.
      const jsonStream = new WebSocketJSONStream(ws);
      // console.log(shareDBServer);
      shareDBServer.listen(jsonStream);
    });
  }

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
