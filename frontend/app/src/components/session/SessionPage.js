import React, {useState} from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Layout, Modal, Button, Row, Col } from "antd";
import ChatBox from "./chat/ChatBox";
import Editor from "./editor/Editor";
import axios from "axios";
import QuestionBox from "./question/QuestionBox";
import "./SessionPage.css";

const box = {
  padding: "8px 0",
  background: "white",
};
// TODO: dynamically get from matching component
const session_id = 2224;

const close_editor_connection = (session_id) => {
  axios
    .delete("http://localhost:6001/api/connection/" + session_id)
    .catch((error) => {
      console.log("Editor's session is not closed properly!");
      console.log(error);
    });
};

const handleExitSession = (session_id) => {
  // Close editor session
  close_editor_connection(session_id);
  // Close chat session

  // Redirect to home page
  window.location.href = "/";
};

const SessionPage = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  
  const handleOk = () => {
    setIsModalVisible(false);
    // TODO: Navigate to matching page
    handleExitSession(session_id)
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  return (
    <>
    <Layout>
      <div className="session-header">
        <Row
          gutter={10}
          style={{ height: "10vh", boxSizing: "border-box", margin: "0% 2%" }}
          justify="center"
          align="middle"
        >
          <Col span={6} style={{ textAlign: "center" }}>
            <div style={box}>Session Page Title</div>
          </Col>
          <Col span={8} style={{ textAlign: "center" }}></Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <div style={box}>
              {" "}
              <AiOutlineUser /> Current User's Name{" "}
            </div>
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <div style={box}>
              {" "}
              <AiOutlineUser /> Peer's Name
            </div>
          </Col>
          <Col span={2} style={{ textAlign: "center" }}>
            <Button onClick={() => showModal()} style={{background: "#8B0000", color: "white"}}>
              Exit Session
            </Button>
          </Col>
        </Row>
      </div>
      <div className="container">
        <Col style={{ margin: "0% 1% 0% 3%" }}>
          <QuestionBox />
          <Editor className="editor" session_id={session_id} />
        </Col>
        <Col style={{ margin: "0% 3% 0% 1%" }}>
          <ChatBox className="chat" />
        </Col>
      </div>
    </Layout>
     <Modal title="Exit the session" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="Yes">
     <p>Are you sure you want to exit the session? Your peer will be here alone trying to solve the question :(</p>
     <p>You will be redirected back to the matching page.</p>
   </Modal>
   </>
  );
};

export default SessionPage;
