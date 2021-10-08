import React from "react";

import { Breadcrumb, Layout } from "antd";
import ChatBox from "./chat/ChatBox";
import Editor from "./editor/Editor";

const { Content } = Layout;

const SessionPage = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Session</Breadcrumb.Item>
        </Breadcrumb>
        <ChatBox />
        <Editor />
      </Content>
    </Layout>
  );
};

export default SessionPage;
