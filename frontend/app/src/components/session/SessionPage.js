import React, { useContext, useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Layout, Modal, Button, Row, Col } from "antd";
import ChatBox from "./chat/ChatBox";
import Editor from "./editor/Editor";
import axios from "axios";
import QuestionBox from "./question/QuestionBox";
import "./SessionPage.css";
import { UserContext } from "../../util/UserProvider";
import MatchingPage from "../matching/MatchingPage";
import { SessionContext } from "../../util/SessionProvider";

const box = {
  padding: "8px 0",
  background: "white",
};
// TODO: dynamically get from matching component
// const session_id = 2224;
// TODO: Replace with existing username/userid, remove nanoid dependency.

const SessionPage = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const sessionContext = useContext(SessionContext);
  const [userToken, setUserToken] = useState("");
  const [username, setUsername] = useState("");
  const { setInitiateDisconnect, hasDisconnected, session, setSession } =
    sessionContext;
  const userContext = useContext(UserContext);

  const session_id = session.sessionInfo.sessionId;
  const question = session.sessionInfo.question;
<<<<<<< HEAD
=======
  console.log(question);

>>>>>>> 9ca997de99fb9e3a50c116130a877d9767e86963
  console.log(session_id);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleExitSession(session_id);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExitSession = (session_id) => {
    // Close editor session
    closeEditorConnection(session_id);
    setInitiateDisconnect(true);
    setSession(null);
  };

  const getPeersName = (currentName) => {

  }

  const closeEditorConnection = (session_id) => {
    // axios
    //   .delete("http://localhost:6001/api/connection/" + session_id)
    //   .catch((error) => {
    //     console.log("Editor's session is not closed properly!");
    //     console.log(error);
    //   });
  };

  useEffect(() => {
    userContext?.user
      ?.getIdToken(false)
      .then(function (idToken) {
        setUserToken(idToken);
      })
      .catch(function (error) {
        // Handle error
      });
    setUsername(userContext?.user?.data?.name?.split(/\s+/)?.[0]);
    console.log(userContext.user);
  }, [userContext.user, userToken]);

  return (
    <>
      <Layout>
        <div className="session-header">
          <Row
            gutter={10}
            style={{
              height: "10vh",
              boxSizing: "border-box",
              margin: "0% 2%",
            }}
            justify="center"
            align="middle"
          >
            <Col span={6} style={{ textAlign: "center" }}>
              <div style={box}>Difficulty: {question.difficulty.toUpperCase()}</div>
            </Col>
            <Col span={8} style={{ textAlign: "center" }}></Col>
            <Col span={4} style={{ textAlign: "center" }}>
              <div style={box}>
                {" "}
                <AiOutlineUser />
                {username}{" "}
              </div>
            </Col>
            <Col span={4} style={{ textAlign: "center" }}>
              <div style={box}>
                {" "}
                <AiOutlineUser /> Peer's Name
              </div>
            </Col>
            <Col span={2} style={{ textAlign: "center" }}>
              <Button
                onClick={() => showModal()}
                style={{ background: "#8B0000", color: "white" }}
              >
                Exit Session
              </Button>
            </Col>
          </Row>
        </div>
        <div className="container">
          <Col style={{ margin: "0% 1% 0% 3%" }}>
            <QuestionBox question={question}/>
            <Editor className="editor" session_id={session_id} />
          </Col>
          <Col style={{ margin: "0% 3% 0% 1%" }}>
            <ChatBox
              className="chat"
              sessionId={session_id}
              username={username}
            />
          </Col>
        </div>
      </Layout>
      <Modal
        title="Exit the session"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
      >
        <p>
          Are you sure you want to exit the session? Your peer will be here
          alone trying to solve the question :(
        </p>
        <p>You will be redirected back to the matching page.</p>
      </Modal>
    </>
  );
};

export default SessionPage;
