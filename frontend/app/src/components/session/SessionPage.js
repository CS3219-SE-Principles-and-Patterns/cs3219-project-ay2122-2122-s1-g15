import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Layout, Card, Button, Row, Col } from "antd";
import ChatBox from "./chat/ChatBox";
import Editor from "./editor/Editor";
import axios from "axios";

const { Content } = Layout;
const box = { border: "1px solid #000000" , padding: "8px 0", background: "white"};

const question = { height: "20vh", border: "1px solid #000000" , padding: "8px 0", background: "white", overflow: "auto", "text-align": "center"};
// TODO: dynamically get from matching component
const session_id_1 = 2224;

const close_editor_connection = (session_id) => {
  axios
    .delete("http://localhost:6001/api/connection/" + session_id)
    .catch((error) => {
      console.log("Editor's session is not closed properly!");
      console.log(error);
    });
}

const handleExitSession = (session_id) => {
  // Close editor session
  close_editor_connection(session_id);
  // Close chat session

  // Redirect to home page
  window.location.href="/";

}

const SessionPage = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        <Row gutter={10} style={{ height: "10vh", boxSizing: "border-box"}} justify="center" align="middle">
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
            <Button onClick={() => handleExitSession(session_id_1)} style={{background: "#8B0000", color: "white"}}>
              Exit Session
            </Button>
          </Col>
        </Row>
        <Row gutter={10} style={{ height: "90vh" , boxSizing: "border-box"}} justify="center">
          <Col span={18}>                                                            
            <Row style={{ height: "20vh" }}>
              <div style={question}> 
                <b> Two Sum </b>

                <br/>

                Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

                You may assume that each input would have exactly one solution, and you may not use the same element twice.

                You can return the answer in any order.

                Example 1:

                Input: nums = [2,7,11,15], target = 9
                Output: [0,1]
                Output: Because nums[0] + nums[1] == 9, we return [0, 1].
                Example 2:

                Input: nums = [3,2,4], target = 6
                Output: [1,2]
                Example 3:

                Input: nums = [3,3], target = 6
                Output: [0,1]
                
              </div>
            </Row>
            <Row style={{ height: "70vh" }}>
              <div> 
                <Editor 
                session_id={session_id_1}
                />
              </div>
            </Row>
          </Col>
          <Col span={6}>
            <ChatBox />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default SessionPage;
