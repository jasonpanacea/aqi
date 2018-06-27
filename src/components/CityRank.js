import React from 'react';
import { Row, Col, Tabs, DatePicker, Table } from 'antd';
import moment from 'moment';

import WholeCountry from './WholeCountry';
import ProvinceOverview from './ProvinceOverview';

const TabPane = Tabs.TabPane;
const { MonthPicker } = DatePicker;
const { Column } = Table;


export default class CityRank extends React.Component {

  state = {
    month: moment(),
  }
  tabChange = (key) => {
    console.log(key);
  }
  monthChange = (date, dateString) => {
    console.log(dateString);
  }
  render() {
    const dataSource = [{
      key: 1,
      number: 1,
      city: '胡彦斌',
      AQI: 32,
      quality: '西湖区湖底',
      rank: 1,
    }, {
      key: 2,
      number: 2,
      city: '胡彦祖',
      AQI: 42,
      quality: '西湖区湖底',
      rank: 2,
    }];
      
    return (
      <div>
        <Row>
          <MonthPicker defaultValue={this.state.month} onChange={this.monthChange} allowClear={false} />
        </Row>
        <Row>
          <Tabs defaultActiveKey="city" onChange={this.tabChange} type="card">
            <TabPane tab="城市排名" key="city">
              <Row>
                <Col span={10}>
                  <Table 
                    dataSource={dataSource} 
                    size="small" 
                    bordered
                    pagination={false}
                    scroll={{ y: 500 }}
                  >
                    <Column
                      title=""
                      dataIndex="number"
                      key="number"
                      width={30}
                    />
                    <Column
                      title="城市"
                      dataIndex="city"
                      key="city"
                      width={50}
                    />
                    <Column
                      title="省份"
                      dataIndex="province"
                      key="province"
                      width={50}
                    />
                    <Column
                      title="AQHI"
                      dataIndex="AQI"
                      key="AQI"
                      width={40}
                      sorter={(a, b) => a.AQI - b.AQI}
                    />
                    <Column
                      title="质量等级"
                      dataIndex="quality"
                      key="quality"
                    />
                    <Column
                      title="pm25"
                      dataIndex="pm25"
                      key="pm25"
                      width={50}
                      sorter={(a, b) => a.pm25 - b.pm25}
                    />
                    <Column
                      title="pm10"
                      dataIndex="pm10"
                      key="pm10"
                      width={50}
                      sorter={(a, b) => a.pm10 - b.pm10}
                    />
                    <Column
                      title="排名"
                      dataIndex="rank"
                      key="rank"
                      width={40}
                      sorter={(a, b) => a.rank - b.rank}
                    />
                  </Table>
                </Col>
                <Col span={14}><WholeCountry /></Col>
              </Row>
            </TabPane>
            <TabPane tab="省份排名" key="province">
              <Row>
                <Col span={10}>
                  <Table 
                    dataSource={dataSource} 
                    size="small" 
                    bordered
                    pagination={false}
                    scroll={{ y: 500 }}
                  >
                    <Column
                      title=""
                      dataIndex="number"
                      key="number"
                      width={30}
                    />
                    <Column
                      title="省份"
                      dataIndex="province"
                      key="province"
                      width={50}
                    />
                    <Column
                      title="城市数"
                      dataIndex="city_count"
                      key="city_count"
                      width={50}
                      sorter={(a, b) => a.city_count - b.city_count}
                    />
                    <Column
                      title="AQHI"
                      dataIndex="AQI"
                      key="AQI"
                      width={40}
                      sorter={(a, b) => a.AQI - b.AQI}
                    />
                    <Column
                      title="质量等级"
                      dataIndex="quality"
                      key="quality"
                    />
                    <Column
                      title="pm25"
                      dataIndex="pm25"
                      key="pm25"
                      width={50}
                      sorter={(a, b) => a.pm25 - b.pm25}
                    />
                    <Column
                      title="pm10"
                      dataIndex="pm10"
                      key="pm10"
                      width={50}
                      sorter={(a, b) => a.pm10 - b.pm10}
                    />
                    <Column
                      title="排名"
                      dataIndex="rank"
                      key="rank"
                      width={40}
                      sorter={(a, b) => a.rank - b.rank}
                    />
                  </Table>
                </Col>
                <Col span={14}><ProvinceOverview /></Col>
              </Row>
            </TabPane>
          </Tabs>
        </Row>
      </div>
      
          
    );
  }
}
