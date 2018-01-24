import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';

const routers = [{
  url: '/good',
  icon: 'home',
  name: '精华'
}, {
  url: '/share',
  icon: '',
  name: '分享'
}, {
  url: '/ask',
  icon: '',
  name: '问答'
}, {
  url: '/job',
  icon: '',
  name: '招聘'
}]
function Header({ location }) {
  return (
    <Menu
      selectedKeys={[location.pathname]}
      mode="horizontal"
      theme="dark"
    >
      <Menu.Item key="/users">
        <Link to="/users"><Icon type="bars" />Users</Link>
      </Menu.Item>
      <Menu.Item key="/">
        <Link to="/"><Icon type="home" />Home</Link>
      </Menu.Item>
      <Menu.Item key="/404">
        <Link to="/page-you-dont-know"><Icon type="frown-circle" />404</Link>
      </Menu.Item>
      <Menu.Item key="/antd">
        <a href="https://github.com/dvajs/dva">dva</a>
      </Menu.Item>
      {
        routers.map(item => (
          <Menu.Item key={item.url}>
            <Link to={item.url}>
              {item.icon && <Icon type={item.icon} />}
              {item.name}
            </Link>
          </Menu.Item>
        ))
      }
    </Menu>
  );
}

export default Header;
