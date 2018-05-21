import React from 'react';
import { BrowserRouter, Route, Redirect, HashRouter, Switch, withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import WholeCountry from './components/WholeCountry';
import ProvinceOverview from './components/ProvinceOverview';
import ThirdComponent from './components/ThirdComponent';
import ProvinceDetail from './components/ProvinceDetail';
import FifthComponent from './components/FifthComponent';

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
                <Menu.Item key="1"><Link to="/country">全国分布</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/province">省份分布</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />趋势分析</span>}>
                <Menu.Item key="6">城市排名</Menu.Item>
                <Menu.Item key="7"><Link to="/fifth">城市对比</Link></Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
              
              <Switch>
                <Route path="/" exact component={WholeCountry} />
                <Route path="/country" component={WholeCountry} />
                <Route path="/province" component={ProvinceOverview} />
                <Route path="/province_detail/:name" component={ProvinceDetail} />
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
