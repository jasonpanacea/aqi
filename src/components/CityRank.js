import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Tabs, DatePicker, Table } from 'antd';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';

import WholeCountry from './WholeCountry';
import ProvinceOverview from './ProvinceOverview';

const TabPane = Tabs.TabPane;
const { MonthPicker } = DatePicker;


export default class CityRank extends React.Component {

  state = {
    month: moment(),
  }
  callback = (key) => {
    console.log(key);
  }
  render() {
    const dataSource = [{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    }];
      
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }];
    return (
      <div>
        <Row>
          <MonthPicker locale={locale} defaultValue={this.state.month} />
        </Row>
        <Row>
          <Tabs defaultActiveKey="city" onChange={this.callback} type="card">
            <TabPane tab="城市排名" key="city">
              <Row>
                <Col span={6}>
                  <Table 
                    dataSource={dataSource} 
                    columns={columns}
                    size="small" 
                    bordered
                    pagination={false}
                  />
                </Col>
                <Col span={18}><WholeCountry /></Col>
              </Row>
            </TabPane>
            <TabPane tab="省份排名" key="province">
              <Row>
                <Col span={6}>
                  <Table 
                    dataSource={dataSource} 
                    columns={columns}
                    size="small" 
                    bordered
                    pagination={false}
                  />
                </Col>
                <Col span={18}><ProvinceOverview /></Col>
              </Row>
            </TabPane>
          </Tabs>
        </Row>
      </div>
      
          
    );
  }
}
