import { useState, useEffect, useContext } from "react";
import { Card, Input, Button, List } from "antd";
import { SendOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import ChatBubble from "./ChatBubble";
import "./ChatBox.css";
import { SessionContext } from "../../../util/SessionProvider";
import InfiniteScroll from "react-infinite-scroll-component";

const { TextArea } = Input;

const ChatBox = (props) => {
  const { username, sessionId, userToken } = props;
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const sessionContext = useContext(SessionContext);
  const { initiateDisconnect, setInitiateDisconnect, session, setSession } =
    sessionContext;

  // TODO: Replace with deployed server endpoint
  // const socket = io("http://localhost:8080/", {
  //   path: "/chat/socket.io/",
  //   extraHeaders: {
  //     bearer: userToken,
  //     "Access-Control-Allow-Origin": "*",
  //   },
  //   transports: ["websocket"],
  // });

  const socket = io("http://34.79.116.255/chat/", {
    path: "/chat/socket.io/",
    transports: ["websocket"],
  });

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const sendChat = (e) => {
    e.preventDefault();
    const formattedMsg = message.trim();
    if (formattedMsg !== "") {
      socket.emit("chat message", {
        message: formattedMsg,
        sender: username,
        sessionId: sessionId,
      });
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
      console.log(payload);
      setChat((chat) => [...chat, payload]);
    });
    socket.on("user disconnected", (payload) => {
      setChat((chat) => [...chat, payload]);
    });
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
      socket.connect();
      const payload = { username, sessionId };
      socket.emit("join room", payload);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (initiateDisconnect === true) {
      console.log("initiating disconnect!");
      const payload = { sessionId, username };
      socket.emit("initiate disconnect", payload);
      setSession(null);
      setInitiateDisconnect(false);
    }
  }, [initiateDisconnect]);

  return (
    <>
      <Card title="Chat" className="card">
        <div id="chat-container" className="chat-container">
          {chat.length === 0 ? (
            <p
              style={{ color: "#cccccc", textAlign: "center", padding: "12px" }}
            >
              <i>This is the beginning of your conversation. Say hi!</i>
            </p>
          ) : (
            <div
              id="scrollableDiv"
              className="scrollable"
              style={{
                overflow: "auto",
                padding: "0 16px",
                height: "600px",
              }}
            >
              <InfiniteScroll
                dataLength={chat.length}
                scrollableTarget="scrollableDiv"
              >
                <List
                  className="message-list"
                  dataSource={chat}
                  renderItem={(payload, index) => (
                    <List.Item>
                      <ChatBubble
                        key={index}
                        msg={payload.message}
                        sender={payload.sender}
                        username={username}
                        id={payload.chatId}
                      />
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          )}
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
