import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Tabs } from 'antd';
import { observer } from 'mobx-react';
import SubItemComponent from './SubItemComponent';

import BaseStore from '../stores/BaseStore';
import AQHITransformer from '../utils/AQHITransformer';

const TabPane = Tabs.TabPane;

@observer
export default class CityCompare extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tab: 'aqi' };
  }
  tabChange = (key) => {
    this.setState({ tab: key });
    const { date_array, city1, city2, date_unit } = this.props;
    BaseStore.fetchCityDetail(date_unit, date_array[0], date_array[date_array.length - 1], key, city1, BaseStore.type.CITY1);
    BaseStore.fetchCityDetail(date_unit, date_array[0], date_array[date_array.length - 1], key, city2, BaseStore.type.CITY2);
  }

  componentWillReceiveProps(nextProps) {
    const { date_array, city1, city2, date_unit } = nextProps;
    BaseStore.fetchCityDetail(date_unit, date_array[0], date_array[date_array.length - 1], this.state.tab, city1, BaseStore.type.CITY1);
    BaseStore.fetchCityDetail(date_unit, date_array[0], date_array[date_array.length - 1], this.state.tab, city2, BaseStore.type.CITY2);
  }

  renderContent = (date_array, city1, city2, date_unit) => {
    return (
      <Row>
        <Col span={24}>
          <ReactEcharts
            style={{ minHeight: '500px' }}
            option={this.getLineOption(date_array, city1, city2, date_unit)}
          />
        </Col>
      </Row>
    );
  }

  getLineOption = (date_array, city1, city2, date_unit) => {
    const option = {
      title: {
        text: `${city1} VS ${city2} ${date_unit}${AQHITransformer.transformQualityUnitText(this.state.tab)}变化趋势`,
        top: 'top',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [city1, city2],
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
          name: city1,
          type: 'line',
          data: BaseStore.cityDetail1.slice(),
        },
        {
          name: city2,
          type: 'line',
          data: BaseStore.cityDetail2.slice(),
        },
      ],
    };
    return option;
  }

  getBarOption = (city1, city2, date_unit) => {
    const option = {
      color: ['#003366', '#006699'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      title: {
        text: `${city1} VS ${city2} ${date_unit}空气质量比较`,
        top: 'top',
        left: 'center',
      },
      legend: {
        data: [city1, city2],
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
          name: '百分比%',
          type: 'value',
        },
      ],
      series: [
        {
          name: city1,
          type: 'bar',
          barGap: 0,
          data: BaseStore.cityQualityDetailForBar(BaseStore.type.CITY1),
        },
        {
          name: city2,
          type: 'bar',
          data: BaseStore.cityQualityDetailForBar(BaseStore.type.CITY2),
        },
      ],
    };
    return option;
  }

  getPieOption = (city, date_unit) => {
    const option = {
      title: {
        text: `${city}${date_unit}AQHI分布情况`,
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
          data: city === this.props.city1 ? BaseStore.risksMap1.slice() : BaseStore.risksMap2.slice(),
        },
      ],
    };
    return option;
  }
  

  render() {
    const { date_array, city1, city2, date_unit } = this.props;
    return (
      <Tabs defaultActiveKey={this.state.tab} onChange={this.tabChange} type="card">
        <TabPane tab="AQHI" key="aqi">
          <Row>
            <Col span={24}>
              <ReactEcharts
                option={this.getLineOption(date_array, city1, city2, date_unit)}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={12}>
              <ReactEcharts
                option={this.getPieOption(city1, date_unit)}
              />
            </Col>
            <Col span={12}>
              <ReactEcharts
                option={this.getPieOption(city2, date_unit)}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={<SubItemComponent pollution="PM" sub="2.5" />} key="pm25">
          {this.renderContent(date_array, city1, city2, date_unit)}
        </TabPane>
        <TabPane tab={<SubItemComponent pollution="PM" sub="10" />} key="pm10">                
          {this.renderContent(date_array, city1, city2, date_unit)}
        </TabPane>
        <TabPane tab={<SubItemComponent pollution="SO" sub="2" />} key="so2">
          {this.renderContent(date_array, city1, city2, date_unit)}
        </TabPane>
        <TabPane tab={<SubItemComponent pollution="NO" sub="2" />} key="no2">
          {this.renderContent(date_array, city1, city2, date_unit)}
        </TabPane>
        <TabPane tab={<SubItemComponent pollution="O" sub="3" />} key="o3">
          {this.renderContent(date_array, city1, city2, date_unit)}
        </TabPane>
        <TabPane tab="CO" key="CO">
          {this.renderContent(date_array, city1, city2, date_unit)}
        </TabPane>
      </Tabs>
      
    );
  }
}
