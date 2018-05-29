import React from 'react';
import { BrowserRouter, Route, HashRouter, Switch, withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import ProvinceDetail from './components/ProvinceDetail';
import FifthComponent from './components/FifthComponent';
import TimeGrid from './components/TimeGrid';

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
                <Menu.Item key="3"><Link to="/TimeGrid">城市排名</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/fifth">城市对比</Link></Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 10px 10px' }}>
            <Content style={{ background: '#fff', padding: 10, margin: 0 }}>
              
              <Switch>
                <Route path="/" exact component={TimeGrid} />
                <Route path="/country" component={TimeGrid} />
                <Route path="/province" component={TimeGrid} />
                <Route path="/province_detail/:name" component={ProvinceDetail} />
                <Route path="/fifth" component={FifthComponent} />
                <Route path="/TimeGrid" component={TimeGrid} />
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
