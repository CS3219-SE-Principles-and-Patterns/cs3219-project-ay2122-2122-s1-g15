import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Layout, Card, Button, Row, Col } from "antd";
import ChatBox from "./chat/ChatBox";
import Editor from "./editor/Editor";
import QuestionBox from "./question/QuestionBox";
import './SessionPage.css'

const box = { border: "1px solid #000000" , padding: "8px 0", background: "white"};
// TODO: dynamically get from matching component
const session_id = 2224;

const handleExitSession = () => {
  // TODO 
  
}

const SessionPage = () => {
  return (
    <Layout>
      <div className="session-header">
      <Row gutter={10} style={{ height: "10vh", boxSizing: "border-box", margin: "0% 2%"}} justify="center" align="middle">
          <Col span={6} style={{ textAlign: "center" }}>
            <div style={box}> Session Page Title</div>
          </Col>
          <Col span={8} style={{ textAlign: "center" }}>
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>                                                            
            <div style={box}> <AiOutlineUser /> Current User's Name </div>
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <div style={box}> <AiOutlineUser /> Peer's Name</div>
          </Col>
          <Col span={2} style={{ textAlign: "center" }}>
            <Button onClick={() => handleExitSession()} style={{background: "#8B0000", color: "white"}}>
              Exit Session
            </Button>
          </Col>
        </Row>
      </div>  
      <div className="container">
          <Col style={{ margin: "0% 1% 0% 3%"}}>
              <QuestionBox />
              <Editor className="editor" session_id={session_id} />
          </Col>
          <Col style={{ margin: "0% 3% 0% 1%"}}>
            <ChatBox className="chat" />
          </Col>
      </div>
    </Layout>
  );
};

export default SessionPage;
