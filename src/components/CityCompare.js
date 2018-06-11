import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Tabs } from 'antd';

const TabPane = Tabs.TabPane;

export default class CityCompare extends React.Component {

  callback = (key) => {
    console.log(key);
  }

  renderContent = () => {
    return (
      <Row>
        <Col span={24}>
          <ReactEcharts
            ref={(e) => { this.echarts_react = e; }}  
            option={this.getLineOption()}
          />
        </Col>
      </Row>
    );
  }

  getLineOption = () => {
    const option = {
      title: {
        text: '北京 VS 杭州',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['北京', '杭州'],
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['05-10', '05-11', '05-12', '05-13', '05-14', '05-15', '05-16'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '北京',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '杭州',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
      ],
    };
    return option;
  }

  getBarOption = () => {
    const option = {
      color: ['#003366', '#006699'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        data: ['北京', '杭州'],
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
          name: '北京',
          type: 'bar',
          barGap: 0,
          data: [10, 52, 200, 334, 390, 330],
        },
        {
          name: '杭州',
          type: 'bar',
          data: [10, 330, 52, 200, 334, 390],
        },
      ],
    };
    return option;
  }

  getPieOption = () => {
    const option = {
      legend: {
        left: 'center',
        bottom: 10,
        data: ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'],
      },
      title: {
        text: '北京日AQI分布情况',
        left: 'center',
      },
    
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {d}%',
      },
    
      series: [
        {
          type: 'pie',
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
    return (
      <Tabs defaultActiveKey="AQI" onChange={this.callback} type="card">
        <TabPane tab="AQI" key="AQI">
          <Row>
            <Col span={18}>
              <ReactEcharts
                option={this.getLineOption()}
              />
            </Col>
            <Col span={6}>
              <ReactEcharts
                option={this.getPieOption()}
              />
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <ReactEcharts
                option={this.getBarOption()}
              />
            </Col>
            <Col span={6}>
              <ReactEcharts
                option={this.getPieOption()}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="PM2.5" key="PM2.5">
          {this.renderContent()}
        </TabPane>
        <TabPane tab="PM10" key="PM10">                
          {this.renderContent()}
        </TabPane>
        <TabPane tab="SO2" key="SO2">
          {this.renderContent()}
        </TabPane>
        <TabPane tab="NO2" key="NO2">
          {this.renderContent()}
        </TabPane>
        <TabPane tab="O3" key="O3">
          {this.renderContent()}
        </TabPane>
        <TabPane tab="CO" key="CO">
          {this.renderContent()}
        </TabPane>
      </Tabs>
      
    );
  }
}
