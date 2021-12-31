import { Button, Col, Form, Input, Row } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./index.less";
function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const response = await axios.post(
      "http://127.0.0.1:4523/mock/526322/api/login",
      values
    );
    const { data } = response;
    navigate("/");
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <div id="login">
      <Row>
        <Col className="title">登录到您的账户</Col>
      </Row>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete={"off"}
        labelCol={{ span: 8 }}
      >
        <Form.Item name={"username"}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name={"password"}>
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type={"primary"}
            htmlType={"submit"}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      <Row>
        <Col offset={20} span={4}>
          <Link to="http://www.baidu.com">忘记密码</Link>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
