import { useState, useEffect, useContext } from "react";
import { Card, Input, Button, List } from "antd";
import { SendOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import ChatBubble from "./ChatBubble";
import "./ChatBox.css";
import { SessionContext } from "../../../util/SessionProvider";

// TODO: Replace with deployed server endpoint
const socket = io("https://34.79.116.255/chat/", {
  path: "/chat/socket.io/",
  secure: true
  // extraHeaders: {
  //   "Access-Control-Allow-Origin": "*",
  // }
});

const { TextArea } = Input;

const ChatBox = (props) => {
  const { username, sessionId } = props;
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const sessionContext = useContext(SessionContext);
  const { initiateDisconnect, setHasDisconnected } = sessionContext;

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const sendChat = (e) => {
    e.preventDefault();
    const formattedMsg = message.trim().replace(/\n$/, "");
    if (formattedMsg !== "") {
      socket.emit("chat message", {
        message: formattedMsg,
        sender: username,
        sessionId: sessionId,
      });
      const payload = { message: formattedMsg, sender: username };
      setChat((chatHistory) => [...chatHistory, payload]);
      console.log(chat);
    }
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      sendChat(e);
    }
  };

  useEffect(() => {
    socket.on("chat message", (payload) => {
      setChat([...chat, payload]);
      console.log(chat);
    });
    socket.on("user disconnected", (payload) => {
      setChat([...chat, payload]);
    });
    socket.on("user connected", (payload) => {
      setChat([...chat, payload]);
    });
    const messageContainer = document.getElementById("message-container");
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
  }, [chat, chat.length]);

  useEffect(() => {
    if (isInitialLoad) {
      const payload = { username, sessionId };
      socket.emit("join room", payload);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, sessionId, username]);

  useEffect(() => {
    if (initiateDisconnect) {
      const payload = { sessionId, username };
      socket.emit("initiate disconnect", payload);
      socket.disconnect(payload);
      setHasDisconnected(true);
    }
  }, [initiateDisconnect, setHasDisconnected, sessionId, username]);

  return (
    <>
      <Card title="Chat" className="card">
        <div className="chat-container">
          <div id="message-container" className="chat-messages">
            {chat.length === 0 ? (
              <p style={{ color: "#cccccc", textAlign: "center" }}>
                <i>This is the beginning of your conversation. Say hi!</i>
              </p>
            ) : (
              <List
                dataSource={chat}
                renderItem={(payload, index) => (
                  <List.Item>
                    <ChatBubble
                      key={index}
                      msg={payload.message}
                      sender={payload.sender}
                      username={username}
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
          <div className="input-container">
            <TextArea
              className="chat-input"
              placeholder="Enter message here!"
              value={message}
              onKeyDown={handleKeyDown}
              autoSize={{ minRows: 1, maxRows: 4 }}
              onChange={onChange}
            />
            <Button
              type="primary"
              shape="circle"
              style={{ marginLeft: "5px" }}
              icon={<SendOutlined />}
              onClick={sendChat}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default ChatBox;
