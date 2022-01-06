import { Button, Col, Form, Input, Row } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';
function Login() {
  return (
    <div id="login">
      <Row>
        <Col className="title">登录到您的账户</Col>
      </Row>
      <Form autoComplete={'off'} labelCol={{ span: 8 }}>
        <Form.Item name={'username'}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name={'password'}>
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: '100%' }}
            type={'primary'}
            htmlType={'submit'}
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
