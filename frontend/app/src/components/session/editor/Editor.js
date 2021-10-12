// Temporary (hardcoded) frontend to test editor functionalities

import React, { useState, useEffect } from "react";
import Quill from "quill";
import axios from "axios";
import "quill/dist/quill.snow.css";
import "./Editor.css";
import "highlight.js/styles/monokai-sublime.css";
import Sharedb from "sharedb/lib/client";
import richText from "rich-text";

// Adding syntax highlight support for common languages
const hljs = require("highlight.js/lib/common");

// Registering the rich text type to make sharedb work with our quill editor
Sharedb.types.register(richText.type);

function Editor(props) {
  const [conn, setConn] = useState();

  function get_connection(session_id) {
    axios
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
    get_connection(props.session_id);
  }, [props])

  useEffect(() => {
    console.log(conn);
    if (conn == null) {
      console.log("Connection not found!");
      return;
    }
    // Setup websocket and shareDB connection
    var port = conn[0].port;
    var document_key = conn[0].document_key;
    const socket = new WebSocket("ws://127.0.0.1:" + port);
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
       * Updaing its content to editor
       */
      quill.setContents(doc.data);
      // quill.formatLine(1, quill.getLength(), { 'code-block': true });

      /**
       * On Text change publishing to our server
       * so that it can be broadcasted to all other clients
       */
      quill.on("text-change", function (delta, oldDelta, source) {
        if (source !== "user") return;
        doc.submitOp(delta, { source: quill });
      });

      /** listening to changes in the document
       * that is coming from our server
       */
      doc.on("op", function (op, source) {
        if (source === quill) return;
        quill.updateContents(op);
      });
    });
    return () => {
      connection.close();
    };
  }, [conn]);

  return (
    <div style={{ margin: "5%", border: "1px solid" }}>
      <div id="editor"></div>
    </div>
  );
}

export default Editor;
