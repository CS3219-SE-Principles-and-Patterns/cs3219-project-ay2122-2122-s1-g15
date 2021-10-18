import { useState, useEffect } from "react";
import { Card, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import ChatBubble from "./ChatBubble";

// TODO: Replace with deployed server endpoint
const socket = io("http://localhost:5000")
// TODO: Replace with existing username/userid, remove nanoid dependency.
const username = nanoid(2)
// TODO: Update to passed in sessionId prop
const sessionId = 1

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

  useEffect(() => {
    socket.on('chat message', (payload) => {
      console.log(payload)
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
    <Card title="Chat" style={{ height: '90vh', overflow: "auto" }}>
      {chat.map((payload, index) => {
        return <ChatBubble key={index} msg={payload.message} isSender={payload.sender === username}/>
      })}
      <Input placeholder="Enter chat message here!" 
        value={message}
        suffix={
          <Button 
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={sendChat} />
        }
        onChange={onChange} />
    </Card>
    </>
  );
};

export default ChatBox;
