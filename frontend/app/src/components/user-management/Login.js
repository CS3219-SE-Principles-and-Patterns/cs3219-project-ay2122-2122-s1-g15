import React, { useState, useContext, useEffect } from "react";
import Auth from "../../util/Authentication";
import { useHistory } from "react-router-dom";
import { Modal, Form, Input, Layout, Col, Row, Button, Space } from "antd";
import logo from "./../../images/PeerPrep.png";
import { UserContext } from "../../util/UserProvider";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};

export default function Login() {
  const history = useHistory();
  const [form] = Form.useForm();
  const [disabledLogin, setDisabledLogin] = useState(true);
  const { Content } = Layout;
  const userContext = useContext(UserContext);

  const handleFormChange = () => {
    setDisabledLogin(
      !form.isFieldsTouched(true) ||
        form.getFieldsError().filter(({ errors }) => errors.length).length > 0
    );
  };

  const handleSubmit = (values) => {
    const { email, password } = values;

    Auth.signIn(email, password)
      .then((credential) => {
        userContext.setUser(credential?.user);
        history.go(0);
      })
      .catch((error) => {
        console.log("Error while logging in: ", error);
        showErrorLoggingInModal(error.message);
      });
  };

  useEffect(() => {
    if (userContext?.user?.data != null) {
      history.push("/");
    }
  }, [userContext]);

  const showErrorLoggingInModal = (errorMessage) => {
    Modal.error({
      title: "Unable to log into account",
      content: errorMessage,
    });
  };

  return (
    <Layout id="login" style={{ height: "100vh" }}>
      <Content style={{ padding: "50px" }}>
        <Row gutter={16} align="center">
          <Col span={8} align="center">
            <Form
              {...layout}
              form={form}
              name="profile"
              onFieldsChange={handleFormChange}
              onFinish={handleSubmit}
            >
              <img
                style={{ width: "15%", paddingBottom: 12 }}
                src={logo}
                alt="PeerPrep Logo"
              />
              <h3 className="formTitle">Login to your PeerPrep account!</h3>

              <Form.Item
                name="email"
                style={{ paddingTop: 20 }}
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
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
              <Form.Item style={{ paddingTop: 12 }}>
                <Space direction="vertical">
                  <Button disabled={disabledLogin} htmlType="submit">
                    <h4>Login</h4>
                  </Button>
                  <Button type="link" href="/register">
                    New here? Register here instead!
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
