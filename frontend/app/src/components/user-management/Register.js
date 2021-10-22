import React, { useState } from "react";
import Auth from "../../util/Authentication";
import { useHistory } from "react-router-dom";
import { Modal, Form, Input, Layout, Col, Row, Button, Space } from "antd";
import { PasswordInput } from "antd-password-input-strength";
import logo from "./../../images/PeerPrep.png";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 40 },
};

export default function Register() {
  const history = useHistory();
  const [form] = Form.useForm();
  const [disabledRegister, setDisabledRegister] = useState(true);
  const { Content } = Layout;

  const handleFormChange = () => {
    setDisabledRegister(
      !form.isFieldsTouched(true) ||
        form.getFieldsError().filter(({ errors }) => errors.length).length > 0
    );
  };

  const handleSubmit = (values) => {
    const { email, password, name } = values;

    Auth.signUp(email, password, name)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
          console.log("Error while signing up: ", error);
          showErrorRegisteringModal(error.message);
        }
      );
  };

  const showErrorRegisteringModal = (errorMessage) => {
    Modal.error({
      title: 'Unable to create account',
      content: errorMessage,
    })
  };

  return (
    <Layout id="register" style={{ height: "100vh" }}>
      <Content style={{ padding: "50px" }}>
        <Row gutter={16} align="center">
          <Col span={8} align="center">
            <Form
              {...layout}
              form={form}
              onFieldsChange={handleFormChange}
              name="profile"
              onFinish={handleSubmit}
            >
              <img
                style={{ width: "15%", paddingBottom: 12 }}
                src={logo}
                alt="PeerPrep Logo"
              />
              <h3 className="formTitle">Register for a PeerPrep account!</h3>

              <Form.Item
                name="name"
                style={{ paddingTop: 20 }}
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
                label="Email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not a valid email!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input autoComplete="none" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    type: "string",
                    min: 8,
                    message: "Password must be at least 8 characters",
                  },
                ]}
              >
                <PasswordInput autoComplete="off" />
              </Form.Item>
              <Form.Item style={{ paddingTop: 12 }}>
                <Space direction="vertical">
                  <Button disabled={disabledRegister} htmlType="submit">
                    <h4>Register</h4>
                  </Button>
                  <Button type="link" href="/login">
                    Have an account? Login instead
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
