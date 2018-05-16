import React from 'react';
import { BrowserRouter, Route, Redirect, HashRouter, Switch, withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import FirstComponent from './components/FirstComponent';
import SecondComponent from './components/SecondComponent';
import ThirdComponent from './components/ThirdComponent';

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
              <SubMenu key="sub1" title={<span><Icon type="user" />指数监测</span>}>
                <Menu.Item key="1"><Link to="/first">全国分布</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/second">省份分布</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/third">重点城市</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />趋势分析</span>}>
                <Menu.Item key="4">城市排名</Menu.Item>
                <Menu.Item key="5">城市对比</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
              
              <Switch>
                <Route path="/" exact component={FirstComponent} />
                <Route path="/first" component={FirstComponent} />
                <Route path="/second" component={SecondComponent} />
                <Route path="/third" component={ThirdComponent} />
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
