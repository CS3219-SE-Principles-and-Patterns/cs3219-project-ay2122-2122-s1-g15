import { useState, useEffect } from "react";
import { Card, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import ChatBubble from "./ChatBubble";
import "./ChatBox.css";

// TODO: Replace with deployed server endpoint
const socket = io("http://localhost:5000")
// TODO: Replace with existing username/userid, remove nanoid dependency.
const username = nanoid(2)
// TODO: Update to passed in sessionId prop
const sessionId = 1

const { TextArea } = Input;

const ChatBox = () => {

  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const sendChat = (e) => {
    e.preventDefault()
    socket.emit('chat message', {message: message, sender: username, sessionId: sessionId})
    const payload = {message: message, sender: username}
    setChat([...chat, payload])
    setMessage('')
  }

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      sendChat(e);
    }
  }

  useEffect(() => {
    socket.on('chat message', (payload) => {
      setChat([...chat, payload])
      console.log(chat)
    })
  })

  useEffect(() => {
    socket.on('user disconnected', (payload) => {
      setChat([...chat, payload])
    })
  })

  useEffect(() => {
    if (isInitialLoad) {
      socket.emit('join room', sessionId)
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  return (
    <>
    <Card title="Chat" className="card">
      <div className="chat-container">
        <div className="chat-messages">
          { chat.length === 0 ? <p style={{color: "#cccccc", textAlign: "center"}}><i>This is the beginning of your conversation. Say hi!</i></p>
          : chat.map((payload, index) => {
            return <ChatBubble key={index} msg={payload.message} isSender={payload.sender === username} />
          })}
        </div>
        <div className="input-container">
          <TextArea 
            className="chat-input"
            placeholder="Enter message here!" 
            value={message}
            onKeyUp={handleKeyUp}
            autoSize={{ minRows: 1, maxRows: 6 }}
            onChange={onChange} />
          <Button 
                type="primary"
                shape="circle"
                style={{marginLeft: "5px"}}
                icon={<SendOutlined />}
                onClick={sendChat} />
        </div>
        </div>
    </Card>
    </>
  );
};

export default ChatBox;
