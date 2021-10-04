const connectionHandler = require("./db");
class EditorService {
    constructor() {
        connectionHandler.connect();
    }

    start_server(port, document_key) {
        console.log("Starting server....");
    }
}

let editorService = new EditorService();
module.exports = editorService;
