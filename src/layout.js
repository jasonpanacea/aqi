import React from 'react';
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import ProvinceDetail from './components/ProvinceDetail';
import TimeGrid from './components/TimeGrid';
import CityRank from './components/CityRank';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

@withRouter
class Frame extends React.Component {
  state = {
    selectedKeys: ['1'],
  }

  componentDidMount = () => {
    if (this.props.location.pathname === '/country' || this.props.location.pathname === '/') {
      this.setState({ selectedKeys: ['1'] });
    } else if (this.props.location.pathname.startsWith('/province')) {
      this.setState({ selectedKeys: ['2'] });
    } else if (this.props.location.pathname === '/cityrank') {
      this.setState({ selectedKeys: ['3'] });
    } else if (this.props.location.pathname === '/citycompare') {
      this.setState({ selectedKeys: ['4'] });
    } 
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.location.pathname === '/country' || nextProps.location.pathname === '/') {
      this.setState({ selectedKeys: ['1'] });
    } else if (nextProps.location.pathname.startsWith('/province')) {
      this.setState({ selectedKeys: ['2'] });
    } else if (nextProps.location.pathname === '/cityrank') {
      this.setState({ selectedKeys: ['3'] });
    } else if (nextProps.location.pathname === '/citycompare') {
      this.setState({ selectedKeys: ['4'] });
    }
  }
  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="header" style={{ background: '#5e327d' }}>
          <span style={{ fontSize: '16px', color: 'white' }}>AQHI预警平台</span>
        </Header>
        <Layout>
          <Sider width={180} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1', 'sub2']}
              style={{ height: '100%', borderRight: 0 }}
              selectedKeys={this.state.selectedKeys}
            >
              <SubMenu key="sub1" title={<span><Icon type="user" />指数监测</span>}>
                <Menu.Item key="1"><Link to="/country">全国分布</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/province">省份分布</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />趋势分析</span>}>
                <Menu.Item key="3"><Link to="/cityrank">城市排名</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/citycompare">城市对比</Link></Menu.Item>
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
                <Route path="/citycompare" component={TimeGrid} />
                <Route path="/cityrank" component={CityRank} />
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
