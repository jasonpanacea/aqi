import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { observer } from 'mobx-react';
import { Row, Col, Radio, DatePicker, Tabs, Cascader, Button } from 'antd';
import moment from 'moment';

import RegionStore from '../stores/RegionStore';


const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@observer
export default class City extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 'AQI',
      date_unit: '小时',
      quality_unit: 'AQI',
      date_range_format: 'YYYY-MM-DD HH',
      date_range_show_time: { format: 'HH' },
      date_array: [],
      default_range: [moment().subtract(1, 'd'), moment()],
      date_range: [moment().subtract(1, 'd'), moment()],
      city: '北京市',
    };
    RegionStore.fetchList();
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


  tabChange = (key) => {
    this.setState({ tab: key });
  }

  onCityChange = (value, selectedOptions) => {
    this.setState({ city: selectedOptions[selectedOptions.length - 1].label });
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

  renderContent = (date_array, city, date_unit) => {
    return (
      <Row>
        <Col span={24}>
          <ReactEcharts
            style={{ minHeight: '500px' }}
            option={this.getLineOption(date_array, city, date_unit)}
          />
        </Col>
      </Row>
    );
  }


  getLineOption = (date_array, city, date_unit) => {
    const option = {
      title: {
        text: `${city} ${date_unit}${this.state.tab}变化趋势`,
        top: 'top',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [city],
        top: 'top',
        left: 'left',
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date_array,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: city,
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
      ],
    };
    return option;
  }

  getBarOption = (city, date_unit) => {
    const option = {
      color: ['#003366', '#006699'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      title: {
        text: `${city} ${date_unit}空气质量比较`,
        top: 'top',
        left: 'center',
      },
      legend: {
        data: [city],
        top: 'top',
        left: 'left',
      },
      xAxis: [
        {
          type: 'category',
          data: ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: city,
          type: 'bar',
          barGap: 0,
          data: [10, 52, 200, 334, 390, 330],
        },
      ],
    };
    return option;
  }

  getPieOption = (city, date_unit) => {
    const option = {
      title: {
        text: `${city}${date_unit}AQI分布情况`,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {d}%',
      },
      series: [
        {
          type: 'pie',
          radius: [0, '50%'],
          data: [
                    { value: 335, name: '优' },
                    { value: 310, name: '良' },
                    { value: 274, name: '轻度污染' },
                    { value: 235, name: '中度污染' },
                    { value: 400, name: '重度污染' },
                    { value: 100, name: '严重污染' },
          ],
        },
      ],
    };
    return option;
  }
  

  render() {
    const date_array = this.state.date_array.map(x => x.date_str);
    return (
      <div>
        <Row>
          <Col span={3}>
            <Cascader
              options={RegionStore.regions}
              expandTrigger="hover"
              placeholder="选择城市"
              popupClassName="popup"
              defaultValue={[this.state.city]}
              onChange={this.onCityChange}
            />
          </Col>
          <Col span={11}>
            <RadioGroup onChange={this.onDateUnitChange} value={this.state.date_unit} size="small">
              <Radio value={'小时'}>小时</Radio>
              <Radio value={'日'}>日</Radio>
              <Radio value={'月'}>月</Radio>
            </RadioGroup>
            <RangePicker style={{ maxWidth: '300px' }} onChange={this.onDateChange} defaultValue={this.state.default_range} value={this.state.date_range} format={this.state.date_range_format} showTime={this.state.date_range_show_time} />
          
          </Col>
        </Row>
        <Tabs defaultActiveKey="AQI" onChange={this.tabChange} type="card" style={{ marginTop: '20px' }}>
          <TabPane tab="AQI" key="AQI">
            <Row>
              <Col span={18}>
                <ReactEcharts
                  option={this.getLineOption(date_array, this.state.city, this.state.date_unit)}
                />
              </Col>
              <Col span={6}>
                <ReactEcharts
                  option={this.getPieOption(this.state.city, this.state.date_unit)}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
              <Col span={16}>
                <ReactEcharts
                  option={this.getBarOption(this.state.city, this.state.date_unit)}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="PM2.5" key="PM2.5">
            {this.renderContent(date_array, this.state.city, this.state.date_unit)}
          </TabPane>
          <TabPane tab="PM10" key="PM10">                
            {this.renderContent(date_array, this.state.city, this.state.date_unit)}
          </TabPane>
          <TabPane tab="SO2" key="SO2">
            {this.renderContent(date_array, this.state.city, this.state.date_unit)}
          </TabPane>
          <TabPane tab="NO2" key="NO2">
            {this.renderContent(date_array, this.state.city, this.state.date_unit)}
          </TabPane>
          <TabPane tab="O3" key="O3">
            {this.renderContent(date_array, this.state.city, this.state.date_unit)}
          </TabPane>
          <TabPane tab="CO" key="CO">
            {this.renderContent(date_array, this.state.city, this.state.date_unit)}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
