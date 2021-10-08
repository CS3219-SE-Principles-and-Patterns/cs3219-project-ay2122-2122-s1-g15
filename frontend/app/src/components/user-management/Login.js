import React from "react";
import Auth from "../../util/Authentication";
import { useHistory } from "react-router-dom";
import { Form, Input, Layout, Col, Row, Button, Space } from "antd";

export default function Login() {
  const history = useHistory();
  const [form] = Form.useForm();
  const { Content } = Layout;

  const handleSubmit = (values) => {
    const { email, password } = values;

    Auth.signIn(email, password)
      .then(() => {
        history.push("/");
      })
      .catch((error) => console.log("Error while logging in", error));
  };

  return (
    <Layout id="login" style={{ height: "100vh" }}>
      <Content style={{ padding: "50px" }}>
        <Col align="center">
          <Row span={8} align="center">
            <Form form={form} name="profile" onFinish={handleSubmit}>
              <p className="formTitle">Login to your PeerPrep account!</p>

              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Space direction="vertical">
                  <Button type="primary" htmlType="submit">
                    Login
                  </Button>
                  <Button type="link" href="/register">
                    New here? Register here instead instead!
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Row>
        </Col>
      </Content>
    </Layout>
  );
}
