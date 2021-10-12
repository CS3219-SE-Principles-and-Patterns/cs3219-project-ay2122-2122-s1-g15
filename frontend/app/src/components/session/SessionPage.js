import React from "react";

import { Breadcrumb, Layout } from "antd";
import ChatBox from "./chat/ChatBox";
import Editor from "./editor/Editor";

const { Content } = Layout;

// TODO: dynamically get from matching component
const session_id = 2224;

const SessionPage = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Session</Breadcrumb.Item>
        </Breadcrumb>
        <ChatBox />
        <Editor 
          session_id={session_id}
        />
      </Content>
    </Layout>
  );
};

export default SessionPage;
