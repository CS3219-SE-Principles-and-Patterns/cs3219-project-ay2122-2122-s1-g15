import React from "react";
import { Layout, Row, Col, Card } from "antd";
// import PacmanLoader from "react-spinners/PacmanLoader";
// import { CountdownCircleTimer } from "react-countdown-circle-timer";
const { Content } = Layout;

const messages = {
  loading: "Hang on tight, finding a peer for you!",
  matchFound: "Found a peer, entering the session...",
};

const countdownStyle = {
  textAlign: "center",
};

const messageStyle = {
  textAlign: "center",
};

const LoadingView = (props) => {
  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        <Row style={{ height: "100vh" }} justify="center" align="middle">
          <Col span={24} style={{ textAlign: "center" }}>
            {/* <PacmanLoader loading={!props.matchFound} color="lightblue" /> */}
          </Col>
          <Col span={24}>
            <Card style={countdownStyle}>{props.remainingTime >= 0 ? props.remainingTime: 0}</Card>
          </Col>
          <Col span={24}>
            <Card style={messageStyle}>
              <p>{props.matchFound ? messages.matchFound : messages.loading }</p>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LoadingView;
