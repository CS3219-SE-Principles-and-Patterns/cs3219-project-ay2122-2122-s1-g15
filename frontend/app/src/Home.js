import React, { useContext } from "react";
import { Layout, Col, Row, Button, Space, Spin } from "antd";
import logo from "./images/PeerPrep.png";
import { UserContext } from "./util/UserProvider";

const { Content } = Layout;

export default function Home() {
  const userContext = useContext(UserContext);
  const loggedIn = userContext?.user?.data?.email != null;

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Content
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Col align="center">
          <Row align="center">
            <img style={{ width: "25%" }} src={logo} alt="PeerPrep Logo" />
          </Row>
          <h2>Welcome to PeerPrep</h2>
          <h3>
            The best platform in helping you to prepare for technical interviews
          </h3>
          {userContext?.user != undefined && !loggedIn && (
            <Row align="center">
              <Space>
                <Button type="primary" href="/register">
                  Register
                </Button>
                <Button type="primary" href="/login">
                  Login
                </Button>
              </Space>
            </Row>
          )}
          {userContext?.user == undefined && (
            <Space style={{ marginTop: 16 }}>
              <Spin size="large" />
            </Space>
          )}
        </Col>
      </Content>
    </Layout>
  );
}
