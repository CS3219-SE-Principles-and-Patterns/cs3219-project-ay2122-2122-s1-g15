import React from "react";
import Auth from "../../util/Authentication";
import { useHistory } from "react-router-dom";
import { Form, Input, Layout, Col, Row, Button, Space } from "antd";

export default function Register() {
  const history = useHistory();
  const [form] = Form.useForm();
  const { Content } = Layout;

  const handleSubmit = (values) => {
    const { email, password, name } = values;
    console.log(values);

    Auth.signUp(email, password, name)
      .then(() => {
        history.push("/");
      })
      .catch((error) => console.log("Error while signing up", error));
  };

  return (
    <Layout id="register" style={{ height: "100vh" }}>
      <Content style={{ padding: "50px" }}>
        <Col align="center">
          <Row span={8} align="center">
            <Form form={form} name="profile" onFinish={handleSubmit}>
              <p className="formTitle">Register for a PeerPrep account!</p>

              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your full name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
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
                    Register
                  </Button>
                  <Button type="link" href="/login">
                    Have an account? Login instead
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
