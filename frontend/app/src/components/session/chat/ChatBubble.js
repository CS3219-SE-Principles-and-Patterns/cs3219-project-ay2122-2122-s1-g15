import React from "react";
import "./ChatBubble.css";

const ChatBubble = (props) => {
  const { isSender, msg } = props;
  if (isSender) {
    return <div className="sent-msg">{msg}</div>;
  } else {
    return <div className="received-msg">{msg}</div>;
  }
};

export default ChatBubble;
