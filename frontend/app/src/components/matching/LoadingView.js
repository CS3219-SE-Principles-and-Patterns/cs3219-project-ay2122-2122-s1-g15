import React from "react";
import { Layout, Row, Col, Card, Spin, Progress, Button } from "antd";
import PacmanLoader from "react-spinners/PacmanLoader";
// import { CountdownCircleTimer } from "react-countdown-circle-timer";
const { Content } = Layout;

const messages = {
  loading: "Hang on tight, finding a peer for you!",
  matchFound: "Found a peer, entering the session...",
};

const countdownStyle = {
  textAlign: "center",
  fontSize: "2rem"
};

const messageStyle = {
  textAlign: "center",
};

const spinnerStyle = {
  textAlign: "center"
}

const MATCH_DURATION = process.env.REACT_APP_MATCH_DURATION || 60

const LoadingView = (props) => {
  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        <Row style={{ height: "100vh" }} justify="center" align="middle" type="flex">
          {/* <Col span={24} style={{ textAlign: "center" }}>
            <PacmanLoader loading={!props.matchFound} color="lightblue" />
          </Col> */}
          <Col span={24}>
            {!props.matchFound ?
            <div style={countdownStyle}><Progress type="circle" percent={props.remainingTime / MATCH_DURATION * 100} format={() => `${props.remainingTime}`} status={props.matchFound ? "success" : (props.remainingTime > 0) ? "normal" : "exception"} /></div>
            :
            <div style={spinnerStyle}><Spin/></div>}
          </Col>
          <Col span={24} align="center">
            {!props.matchFound && <Button onClick={props.handleMatchCancel}>Cancel</Button>}
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
