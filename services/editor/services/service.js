const connectionHandler = require("./db");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const ShareDB = require("sharedb");
const shareDBServer = new ShareDB();
const connection = shareDBServer.connect();

class EditorService {
  constructor() {
    connectionHandler.connect();
    // this.shareDBServer = new ShareDB();
    // console.log(this.shareDBServer);
  }

  start_server(port, document_key) {
    console.log("Starting server....");
    ShareDB.types.register(require("rich-text").type);
    // console.log(this.shareDBServer);
    // const shareDBServer = new ShareDB();
    // const connection = shareDBServer.connect();
    /**
     * 'documents' is collection name(table name in sql terms)
     * 'firstDocument' is the id of the document
     */
    const doc = connection.get("documents", document_key);

    doc.fetch(function (err) {
      if (err) throw err;
      if (doc.type === null) {
        /**
         * If there is no document with id "firstDocument" in memory
         * we are creating it and then starting up our ws server
         */
        doc.create([{ insert: "Hello World!" }], "rich-text", () => {
          const wss = new WebSocket.Server({ port: port });

          wss.on("connection", function connection(ws) {
            // For transport we are using a ws JSON stream for communication
            // that can read and write js objects.
            const jsonStream = new WebSocketJSONStream(ws);
            // console.log(shareDBServer);
            shareDBServer.listen(jsonStream);
          });
        });
        return;
      }
    });
  }

  remove_document(document_key) {

    const doc = connection.get("documents", document_key);
    console.log(doc)
    doc.del(function (err) {
        if (err) {throw err};
      }
    );
  }
}

let editorService = new EditorService();
module.exports = editorService;
