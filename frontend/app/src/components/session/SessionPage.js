import React, { useContext, useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Layout, Modal, Button, Row, Col, PageHeader } from "antd";
import ChatBox from "./chat/ChatBox";
import Editor from "./editor/Editor";
import axios from "axios";
import QuestionBox from "./question/QuestionBox";
import TokenLoadingView from "./TokenLoadingView";
import "./SessionPage.css";
import { UserContext } from "../../util/UserProvider";
import { SessionContext } from "../../util/SessionProvider";

const box = {
  padding: "8px 12px",
  background: "white",
};

const SessionPage = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const sessionContext = useContext(SessionContext);
  const [userToken, setUserToken] = useState("");
  const [username, setUsername] = useState("");
  const { setInitiateDisconnect, session } = sessionContext;
  const userContext = useContext(UserContext);

  const session_id = session?.sessionInfo?.sessionId || "1234";
  const question = session?.sessionInfo?.question;
  const peer = session?.matchedUser?.displayName;

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
    // setSession(null);
  };

  const closeEditorConnection = (session_id) => {
    axios
      .delete("https://peerprep.ninja/editor/api/connection/" + session_id)
      .catch((error) => {
        console.log("Editor's session is not closed properly!");
        console.log(error);
      });
  };

  useEffect(() => {
    userContext?.user?.getIdToken(false).then(function (idToken) {
      setUserToken(idToken);
      console.log(userToken);
    });
    setUsername(userContext?.user?.data?.name?.split(/\s+/)?.[0]);
  }, [userContext.user, userToken]);

  if (userToken !== "") {
    return (
      <>
        <Layout>
          <PageHeader
            className="session-header"
            ghost={false}
            title={`Difficulty: ${question.difficulty.toUpperCase()}`}
            extra={[
              <div className="user-box">
                <span>
                  <AiOutlineUser /> Current User: {username}{" "}
                </span>
              </div>,
              <div className="user-box">
                <span>
                  <AiOutlineUser /> Peer's Name: {peer}
                </span>
              </div>,
              <Button
                onClick={() => showModal()}
                style={{ background: "#8B0000", color: "white" }}
              >
                Exit Session
              </Button>,
            ]}
          ></PageHeader>
          <div className="container">
            <Col style={{ margin: "0% 1% 0% 3%", height: "fit-content" }}>
              <QuestionBox question={question} />
              <Editor className="editor" session_id={session_id} />
            </Col>
            <Col style={{ margin: "0% 3% 0% 1%" }}>
              <ChatBox
                className="chat"
                sessionId={session_id}
                username={username}
                userToken={userToken}
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
  } else {
    return <TokenLoadingView />;
  }
};

export default SessionPage;
