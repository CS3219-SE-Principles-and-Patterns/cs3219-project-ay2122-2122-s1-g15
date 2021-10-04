import React from "react";
import { Layout } from "antd";
import logo from "./images/PeerPrep.png"

const { Content } = Layout;

const Home = () => {
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
        <img
          style={{ width: "25%" }}
          src={logo}
          alt="PeerPrep Logo"
        />
        <h2>Welcome to PeerPrep</h2>
        <h3>The best platform in helping you to prepare for technical interviews</h3>
      </Content>
    </Layout>
  );
};

export default Home;
