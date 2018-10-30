import React from 'react';
import { Row, Col, Tabs, DatePicker, Table } from 'antd';
import moment from 'moment';
import { observer } from 'mobx-react';
import WholeCountry from './WholeCountry';
import ProvinceOverview from './ProvinceOverview';
import SubItemComponent from './SubItemComponent';
import BaseStore from '../stores/BaseStore';

const TabPane = Tabs.TabPane;
const { MonthPicker } = DatePicker;
const { Column } = Table;

@observer
export default class CityRank extends React.Component {

  constructor(props) {
    super(props);
    this.dateString = moment().format('YYYY-MM');
    this.activeKey = 'city';
    this.fetch();
  }

  tabChange = (activeKey) => {
    this.activeKey = activeKey;
    this.fetch();
  }

  monthChange = (date, dateString) => {
    this.dateString = dateString;
    this.fetch();
  }

  fetch = () => {
    if (this.activeKey === 'city') { BaseStore.fetchCityRank(this.dateString); } else { BaseStore.fetchProvinceRank(this.dateString); }
  }

  render() {
    return (
      <div>
        <Row>
          <MonthPicker defaultValue={moment()} onChange={this.monthChange} allowClear={false} />
        </Row>
        <Row>
          <Tabs defaultActiveKey={this.activeKey} onChange={this.tabChange} type="card">
            <TabPane tab="城市排名" key="city">
              <Row>
                <Col span={10}>
                  <Table 
                    dataSource={BaseStore.cityRank.slice()} 
                    size="small" 
                    bordered
                    pagination={false}
                    scroll={{ y: 500 }}
                  >
                    <Column
                      title=""
                      dataIndex="rank"
                      key="rank"
                      width={40}
                    />
                    <Column
                      title="城市"
                      dataIndex="city"
                      key="city"
                      width={140}
                    />
                    <Column
                      title="省份"
                      dataIndex="province"
                      key="province"
                      width={110}
                    />
                    <Column
                      title="AQHI"
                      dataIndex="aqi"
                      key="aqi"
                      width={80}
                      sorter={(a, b) => a.aqi - b.aqi}
                    />
                    <Column
                      title={<SubItemComponent pollution="PM" sub="2.5" />}
                      dataIndex="pm25"
                      key="pm25"
                      width={80}
                      sorter={(a, b) => a.pm25 - b.pm25}
                    />
                    <Column
                      title={<SubItemComponent pollution="PM" sub="10" />}
                      dataIndex="pm10"
                      key="pm10"
                      sorter={(a, b) => a.pm10 - b.pm10}
                    />
                  </Table>
                </Col>
                <Col span={14}><WholeCountry date_unit={'月'} date_str={this.dateString} quality_unit={'aqi'} /></Col>
              </Row>
            </TabPane>
            <TabPane tab="省份排名" key="province">
              <Row>
                <Col span={10}>
                  <Table 
                    dataSource={BaseStore.provinceRank.slice()} 
                    size="small" 
                    bordered
                    pagination={false}
                    scroll={{ y: 500 }}
                  >
                    <Column
                      title=""
                      dataIndex="rank"
                      key="rank"
                      width={40}
                    />
                    <Column
                      title="省份"
                      dataIndex="province"
                      key="province"
                      width={100}
                    />
                    <Column
                      title="城市数"
                      dataIndex="city_count"
                      key="city_count"
                      width={90}
                      sorter={(a, b) => a.city_count - b.city_count}
                    />
                    <Column
                      title="AQHI"
                      dataIndex="aqi"
                      key="aqi"
                      width={90}
                      sorter={(a, b) => a.aqi - b.aqi}
                    />
                    <Column
                      title={<SubItemComponent pollution="PM" sub="2.5" />}
                      dataIndex="pm25"
                      key="pm25"
                      width={90}
                      sorter={(a, b) => a.pm25 - b.pm25}
                    />
                    <Column
                      title={<SubItemComponent pollution="PM" sub="10" />}
                      dataIndex="pm10"
                      key="pm10"
                      sorter={(a, b) => a.pm10 - b.pm10}
                    />
                  </Table>
                </Col>
                <Col span={14}><ProvinceOverview date_unit={'月'} date_str={this.dateString} quality_unit={'aqi'} /></Col>
              </Row>
            </TabPane>
          </Tabs>
        </Row>
      </div>
      
          
    );
  }
}
