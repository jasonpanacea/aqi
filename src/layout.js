import React from 'react';
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import ProvinceDetail from './components/ProvinceDetail';
import TimeGrid from './components/TimeGrid';
import CityRank from './components/CityRank';
import City from './components/City';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

@withRouter
class Frame extends React.Component {
  state = {
    selectedKeys: ['country'],
  }

  componentDidMount = () => {
    if (this.props.location.pathname === '/country' || this.props.location.pathname === '/') {
      this.setState({ selectedKeys: ['country'] });
    } else if (this.props.location.pathname.startsWith('/province')) {
      this.setState({ selectedKeys: ['province'] });
    } else {
      this.setState({ selectedKeys: [this.props.location.pathname.substring(1)] });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.location.pathname === '/country' || nextProps.location.pathname === '/') {
      this.setState({ selectedKeys: ['country'] });
    } else if (nextProps.location.pathname.startsWith('/province')) {
      this.setState({ selectedKeys: ['province'] });
    } else {
      this.setState({ selectedKeys: [nextProps.location.pathname.substring(1)] });
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
                <Menu.Item key="country"><Link to="/country">全国分布</Link></Menu.Item>
                <Menu.Item key="province"><Link to="/province">省份分布</Link></Menu.Item>
                <Menu.Item key="city"><Link to="/city">重点城市</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="laptop" />趋势分析</span>}>
                <Menu.Item key="cityrank"><Link to="/cityrank">城市排名</Link></Menu.Item>
                <Menu.Item key="citycompare"><Link to="/citycompare">城市对比</Link></Menu.Item>
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
                <Route path="/citycompare" exact component={TimeGrid} />
                <Route path="/cityrank" exact component={CityRank} />
                <Route path="/city" exact component={City} />
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
