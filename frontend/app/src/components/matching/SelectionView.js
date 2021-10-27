import React from "react";

import { Layout, Card, Button, Row, Col } from "antd";

const { Content } = Layout;

const gridStyle = {
  textAlign: "center",
  cursor: "pointer",
  width: "100%",
};

const selectedGridStyle = {
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: "lightblue",
  width: "100%",
};

const SelectionView = (props) => {
  const handleClick = (index) => {
    props.handleQuestionSelect(index);
  };

  const handleSubmitMatchRequest = () => {
    props.handleSubmitMatchRequest();
  };

  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        <Row style={{ height: "50vh" }} justify="center" align="middle">
          <Col span={18}>
            <Card title="Select Question Difficulty">
              {props.questionDifficulties.map((item, index) => {
                if (index === props.selected) {
                  return (
                    <Card.Grid
                      key={index}
                      style={selectedGridStyle}
                      onClick={() => handleClick(index)}
                    >
                      {item.value}
                    </Card.Grid>
                  );
                }
                return (
                  <Card.Grid
                    key={index}
                    style={gridStyle}
                    onClick={() => handleClick(index)}
                  >
                    {item.value}
                  </Card.Grid>
                );
              })}
            </Card>
          </Col>
        </Row>
        <Row style={{ height: "50vh" }} justify="center" align="middle">
          <Col>
            <Button
              onClick={handleSubmitMatchRequest}
              disabled={props.selected === null}
            >
              Find a match!
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default SelectionView;
