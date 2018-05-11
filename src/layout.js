import React from 'react';
import { BrowserRouter, Route, Redirect, HashRouter, Switch, withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import FirstComponent from './components/FirstComponent';
import SecondComponent from './components/SecondComponent';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class Frame extends React.Component {
  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="header">
          <span>AQI预警平台</span>
          <span>用户名</span>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                <Menu.Item key="1"><Link to="/first">first</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/second">second</Link></Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
              
              <Switch>
                <Route path="/" exact component={FirstComponent} />
                <Route path="/first" component={FirstComponent} />
                <Route path="/second" component={SecondComponent} />
              </Switch>
              
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
  
}

export default Frame
;
