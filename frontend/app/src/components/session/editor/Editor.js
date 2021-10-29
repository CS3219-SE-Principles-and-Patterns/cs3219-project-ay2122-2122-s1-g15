import React, { useState, useEffect } from "react";
import Quill from "quill";
import axios from "axios";
import "quill/dist/quill.snow.css";
import "./Editor.css";
import "highlight.js/styles/monokai-sublime.css";
import Sharedb from "sharedb/lib/client";
import richText from "rich-text";

const WSS_PORT = 6100;

// Adding syntax highlight support for common languages
const hljs = require("highlight.js/lib/common");

// Registering the rich text type to make sharedb work with our quill editor
Sharedb.types.register(richText.type);

function Editor(props) {
  const [conn, setConn] = useState();
  const [hasConnected, setHasConnected] = useState(false);
  // const [peerDisconnected, setPeerDisconnected] = useState(false);

  async function get_connection(session_id) {
    const body = {"session_id": session_id};
    console.log("Sending post request");
    await axios
      .post("http://localhost:6001/api/connection/", body)
      .catch((error) => {
        console.log("Failed to create connection object!");
        console.log(error);
      });
    console.log("Getting created connection");
    await axios
      .get("http://localhost:6001/api/connection/" + session_id)
      .then((res) => {
        setConn(res.data.data);
        // console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        setConn(null);
      });
  }

  // Get Connection object from api
  useEffect(() => {
    if (!hasConnected) {
      get_connection(props.session_id);
    }
  }, [props]);

  useEffect(() => {
    if (!hasConnected) {
      console.log(conn);
      if (conn == null) {
        console.log("Connection not found!");
        return;
      }
      // Setup websocket and shareDB connection
      var port = conn[0].port;
      var document_key = conn[0].document_key;
      const socket = new WebSocket("ws://127.0.0.1:" + WSS_PORT);
      const connection = new Sharedb.Connection(socket);
      // Querying for our document
      const doc = connection.get("documents", document_key);

      doc.subscribe(function (err) {
        if (err) throw err;
        // const toolbarOptions = ['bold', 'italic', 'underline', 'strike', 'align'];
        hljs.configure({
          languages: ["javascript", "java", "python"],
        });
        const options = {
          modules: {
            syntax: {
              highlight: (text) => hljs.highlightAuto(text).value,
            },
            toolbar: [
              [
                "bold",
                "italic",
                "underline",
                "strike",
                {
                  color: [],
                },
                {
                  background: [],
                },
                {
                  font: [],
                },
                {
                  size: [],
                },
                {
                  align: [],
                },
                "image",
                "code-block",
              ],
            ],
          },
          scrollingContainer: "#editorcontainer",
          theme: "snow",
        };

        let quill = new Quill("#editor", options);
        /**
         * On Initialising if data is present in server
         * Updating its content to editor
         */
        quill.setContents(doc.data);

         doc.on("del", function (op, source) {
          console.log("Peer disconnected!");
        });

        /**
         * On Text change publishing to our server
         * so that it can be broadcasted to all other clients
         */
        quill.on("text-change", function (delta, oldDelta, source) {
          if (source !== "user") return;
          if (!doc.type) return;
          doc.submitOp(delta, { source: quill });
          
        });

        /** listening to changes in the document
         * that is coming from our server
         */
        doc.on("op", function (op, source) {
          if (source === quill) return;
          quill.updateContents(op);
        });

        setHasConnected(true);
      });
    }
    return;
  }, [conn]);

  return (
    <div style={{ marginTop: "1%", border: "1px solid" }}>
      <div id="editor"></div>
    </div>
  );
}

export default Editor;
