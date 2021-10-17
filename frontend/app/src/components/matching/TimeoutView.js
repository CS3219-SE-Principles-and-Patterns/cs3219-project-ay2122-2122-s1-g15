import React from "react";
import { Layout, Row, Col, Card, Button } from "antd";
const { Content } = Layout;

const messageStyle = {
  textAlign: "center",
};

const TimeoutView = (props) => {
  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        <Row style={{ height: "100vh" }} justify="center" align="middle">
          <Col span={24} style={{ textAlign: "center" }}>
            <Card style={messageStyle}>
              <p>
                Oh dear... looks like no one else is available! Try again later.
              </p>
            </Card>
          </Col>
          <Col>
            <Button onClick={props.handleReturnToSelection}>
              Return to question selection page
            </Button>
            <Button onClick={props.handleRetryMatch}>
              Retry with same selection
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default TimeoutView;
