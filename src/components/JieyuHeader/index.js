import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';
const JieyuHeader = () => {
  const navs = [
    {
      title: '首页',
      path: '/',
    },
    {
      title: '基金',
      path: '/funds',
    },
    {
      title: '股票',
      path: '/stocks',
    },
  ];
  return (
    <div className="header">
      <div className="nav_left">
        <Row style={{ align: 'middle' }}>
          <Col offset={5} span={2} className="menu_home">
            <div className="menu_home1">
              <img className="logo" src="/images/logo.png" alt=""></img>
              <div className="home">
                <Link to={'/'}>解语科技</Link>
              </div>
            </div>
          </Col>
          {navs.map((item) => {
            return (
              <Col span={1} key={item.title} className="menu_item">
                <Link to={item.path}>{item.title}</Link>
              </Col>
            );
          })}
          <Col className="menu_item" offset={7} span={1}>
            <Link to="/" id="login">
              登录
            </Link>
          </Col>
        </Row>
      </div>
      <div className="nav_right"></div>
    </div>
  );
};

export default JieyuHeader;
