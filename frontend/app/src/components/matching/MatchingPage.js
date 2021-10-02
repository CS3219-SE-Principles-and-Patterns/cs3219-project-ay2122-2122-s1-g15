import React from "react";

import { Breadcrumb, Layout } from "antd";

const { Content } = Layout;

const MatchingPage = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Matching</Breadcrumb.Item>
        </Breadcrumb>
      </Content>
    </Layout>
  );
};

export default MatchingPage;
