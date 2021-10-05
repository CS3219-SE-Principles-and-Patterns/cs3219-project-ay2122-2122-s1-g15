import { useState, useEffect } from "react";
import { Card, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import ChatBubble from "./ChatBubble";

// TODO: Replace with deployed server endpoint
const socket = io("http://localhost:5000");
const username = nanoid(2);

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  // TODO: Replace with existing username/userid, remove nanoid dependency.

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat message", { message, username });
    console.log(username);
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat message", (payload) => {
      setChat([...chat, payload]);
    });
  });

  return (
    <>
      <Card title="Chat" style={{ width: 300, height: 400, overflow: "auto" }}>
        {chat.map((payload, index) => {
          return (
            <ChatBubble
              key={index}
              msg={payload.message}
              isSender={payload.username === username}
            />
          );
        })}
        <Input
          placeholder="Enter chat message here!"
          value={message}
          suffix={
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={sendChat}
            />
          }
          onChange={onChange}
        />
      </Card>
    </>
  );
};

export default ChatBox;
