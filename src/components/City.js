import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Radio, DatePicker, Tabs, Cascader, Button } from 'antd';
import moment from 'moment';

import RegionStore from '../stores/RegionStore';
import BaseStore from '../stores/BaseStore';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@withRouter
@observer
export default class City extends React.Component {

  constructor(props) {
    super(props);
    let cur = moment().subtract(1, 'd');
    const end = moment();
    let count = 1;
    const date_array = [];
    while (cur.isBefore(end) || cur.isSame(end)) {
      date_array.push({ key: count, number: count, date_str: cur.format('YYYY-MM-DD HH') });
      cur = cur.add(1, 'h');
      count += 1;
    }
    this.state = {
      tab: 'aqi',
      date_unit: '小时',
      quality_unit: 'aqi',
      date_range_format: 'YYYY-MM-DD HH',
      date_range_show_time: { format: 'HH' },
      date_array,
      default_range: [moment().subtract(1, 'd'), moment()],
      date_range: [moment().subtract(1, 'd'), moment()],
    };
    RegionStore.fetchList();
    BaseStore.fetchCityDetail(this.state.date_unit, date_array[0].date_str, date_array[date_array.length - 1].date_str, this.state.tab, BaseStore.detailCity);
    BaseStore.fetchCityQuality(this.state.date_unit, date_array[0].date_str, date_array[date_array.length - 1].date_str, BaseStore.detailCity);
  }

  tabChange = (key) => {
    this.setState({ tab: key });
    BaseStore.fetchCityDetail(this.state.date_unit, this.state.date_array[0].date_str, this.state.date_array[this.state.date_array.length - 1].date_str, key, BaseStore.detailCity);
  }

  onCityChange = (value, selectedOptions) => {
    const city = selectedOptions[selectedOptions.length - 1].label;
    BaseStore.detailCity = city;
    BaseStore.fetchCityDetail(this.state.date_unit, this.state.date_array[0].date_str, this.state.date_array[this.state.date_array.length - 1].date_str, this.state.tab, city);
    BaseStore.fetchCityQuality(this.state.date_unit, this.state.date_array[0].date_str, this.state.date_array[this.state.date_array.length - 1].date_str, city);
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
    BaseStore.fetchCityDetail(e.target.value, date_array[0].date_str, date_array[date_array.length - 1].date_str, this.state.tab, BaseStore.detailCity);
    BaseStore.fetchCityQuality(e.target.value, date_array[0].date_str, date_array[date_array.length - 1].date_str, BaseStore.detailCity);
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
    BaseStore.fetchCityDetail(this.state.date_unit, date_array[0].date_str, date_array[date_array.length - 1].date_str, this.state.tab, BaseStore.detailCity);
    BaseStore.fetchCityQuality(this.state.date_unit, date_array[0].date_str, date_array[date_array.length - 1].date_str, BaseStore.detailCity);
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
          data: BaseStore.cityDetail.slice(),
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
          data: BaseStore.cityQualityDetailForBar.slice(),
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
          data: BaseStore.cityQualityDetail.slice(),
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
              defaultValue={BaseStore.detailProvince === '' ? [BaseStore.detailCity] : [BaseStore.detailProvince, BaseStore.detailCity]}
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
        <Tabs defaultActiveKey="aqi" onChange={this.tabChange} type="card" style={{ marginTop: '20px' }}>
          <TabPane tab="AQI" key="aqi">
            <Row>
              <Col span={18}>
                <ReactEcharts
                  option={this.getLineOption(date_array, BaseStore.detailCity, this.state.date_unit)}
                />
              </Col>
              <Col span={6}>
                <ReactEcharts
                  option={this.getPieOption(BaseStore.detailCity, this.state.date_unit)}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
              <Col span={16}>
                <ReactEcharts
                  option={this.getBarOption(BaseStore.detailCity, this.state.date_unit)}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="PM2.5" key="pm25">
            {this.renderContent(date_array, BaseStore.detailCity, this.state.date_unit)}
          </TabPane>
          <TabPane tab="PM10" key="pm10">                
            {this.renderContent(date_array, BaseStore.detailCity, this.state.date_unit)}
          </TabPane>
          <TabPane tab="SO2" key="SO2">
            {this.renderContent(date_array, BaseStore.detailCity, this.state.date_unit)}
          </TabPane>
          <TabPane tab="NO2" key="NO2">
            {this.renderContent(date_array, BaseStore.detailCity, this.state.date_unit)}
          </TabPane>
          <TabPane tab="O3" key="O3">
            {this.renderContent(date_array, BaseStore.detailCity, this.state.date_unit)}
          </TabPane>
          <TabPane tab="CO" key="CO">
            {this.renderContent(date_array, BaseStore.detailCity, this.state.date_unit)}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
