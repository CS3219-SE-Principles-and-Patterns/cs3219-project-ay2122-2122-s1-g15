import React from "react";
import "./ChatBubble.css";

const ChatBubble = (props) => {
  const { sender, msg, username } = props;
  switch (sender) {
    case username:
      return (
        <div className="sent-msg">
          <p>{msg}</p>
        </div>
      );
    case "server":
      return (
        <div className="server-msg">
          <p>
            <i>{msg}</i>
          </p>
        </div>
      );
    default:
      return (
        <>
          <div className="received-msg">
            <p>{msg}</p>
          </div>
        </>
      );
  }
};

export default ChatBubble;
