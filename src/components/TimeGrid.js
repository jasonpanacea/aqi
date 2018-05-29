import React from 'react';
import { Row, Col, Radio, DatePicker, Table } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import WholeCountry from './WholeCountry';
import ProvinceOverview from './ProvinceOverview';

const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { Column } = Table;

@withRouter
export default class TimeGrid extends React.Component {
  state = {
    date_unit: '小时',
    quality_unit: 'AQI',
    date_range_format: 'YYYY-MM-DD HH',
    date_range_show_time: { format: 'HH' },
    date_array: [],
    default_range: [moment().subtract(1, 'd'), moment()],
    date_range: [moment().subtract(1, 'd'), moment()],
  }
  componentDidMount() {
    let cur = moment().subtract(1, 'd');
    const end = moment();
    let count = 1;
    const date_array = [];
    while (cur.isBefore(end) || cur.isSame(end)) {
      date_array.push({ key: count, number: count, date_str: cur.format(this.state.date_range_format) });
      cur = cur.add(1, 'h');
      count += 1;
    }
    this.setState({
      date_array,
    });
  }
  onDateUnitChange = (e) => {
    this.setState({
      date_unit: e.target.value,
    });
    let unit = 'h';
    let start = moment().subtract(1, 'd');
    let date_range_format = 'YYYY-MM-DD HH';
    if (e.target.value === '小时') {
      this.setState({
        date_range_show_time: { format: 'HH' },
        date_range_format: 'YYYY-MM-DD HH',
        date_range: [moment().subtract(1, 'd'), moment()],
      });
      unit = 'h';
      start = moment().subtract(1, 'd');
      date_range_format = 'YYYY-MM-DD HH';
    } else if (e.target.value === '日') {
      this.setState({
        date_range_show_time: false,
        date_range_format: 'YYYY-MM-DD',
        date_range: [moment().subtract(30, 'd'), moment()],
      });
      unit = 'd';
      start = moment().subtract(30, 'd');
      date_range_format = 'YYYY-MM-DD';
    } else if (e.target.value === '月') {
      this.setState({
        date_range_show_time: false,
        date_range_format: 'YYYY-MM',
        date_range: [moment().subtract(12, 'M'), moment()],
      });
      unit = 'M';
      start = moment().subtract(12, 'M');
      date_range_format = 'YYYY-MM';
    }
    let cur = start;
    const end = moment();
    let count = 1;
    const date_array = [];
    while (cur.isBefore(end) || cur.isSame(end)) {
      date_array.push({ key: count, number: count, date_str: cur.format(date_range_format) });
      cur = cur.add(1, unit);
      count += 1;
    }
    this.setState({
      date_array,
    });
  }
  onQualityUnitChange = (e) => {
    this.setState({
      quality_unit: e.target.value,
    });
  }
  
  onDateChange = (dates, dateStrings) => {
    this.setState({ date_range: dates });
    const start = moment(dateStrings[0], this.state.date_range_format);
    const end = moment(dateStrings[1], this.state.date_range_format);
    let cur = start;
    let unit;
    if (this.state.date_unit === '小时') {
      unit = 'h';
    } else if (this.state.date_unit === '日') {
      unit = 'd';
    } else {
      unit = 'M';
    }
    let count = 1;
    const date_array = [];
    while (cur.isBefore(end) || cur.isSame(end)) {
      date_array.push({ key: count, number: count, date_str: cur.format(this.state.date_range_format) });
      cur = cur.add(1, unit);
      count += 1;
    }
    this.setState({
      date_array,
    });
  }

  renderContent = () => {
    if (this.props.location.pathname === '/country' || this.props.location.pathname === '/') {
      return <WholeCountry />;
    } else if (this.props.location.pathname === '/province') {
      return <ProvinceOverview />;
    }
  }
  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            <RadioGroup onChange={this.onDateUnitChange} value={this.state.date_unit} size="small">
              <Radio value={'小时'}>小时</Radio>
              <Radio value={'日'}>日</Radio>
              <Radio value={'月'}>月</Radio>
            </RadioGroup>
            <RangePicker onChange={this.onDateChange} defaultValue={this.state.default_range} value={this.state.date_range} format={this.state.date_range_format} showTime={this.state.date_range_show_time} />
          </Col>
          <Col span={12}>
            <RadioGroup onChange={this.onQualityUnitChange} value={this.state.quality_unit} size="small">
              <Radio value={'AQI'}>AQI</Radio>
              <Radio value={'PM2.5'}>PM2.5</Radio>
              <Radio value={'PM10'}>PM10</Radio>
              <Radio value={'SO2'}>SO2</Radio>
              <Radio value={'NO2'}>NO2</Radio>
              <Radio value={'O3'}>O3</Radio>
              <Radio value={'CO'}>CO</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <Table 
              dataSource={this.state.date_array} 
              size="small" 
              bordered
              pagination={false}
              scroll={{ y: 600 }}
              onRow={(record) => {
                return {
                  onClick: () => { console.log(record); },
                };
              }}
            >
              <Column
                title=""
                dataIndex="number"
                key="number"
                width={30}
              />
              <Column
                title="监测时间点"
                dataIndex="date_str"
                key="date_str"
                width={60}
              />
            </Table>
          </Col>
          <Col span={20}>{this.renderContent()}</Col>
        </Row>
      </div>        
        
    );
  }
}
