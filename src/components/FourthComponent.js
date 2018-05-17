import React from 'react';
import ReactEcharts from 'echarts-for-react';

import 'echarts/map/js/province/heilongjiang.js';

export default class FirstComponent extends React.Component {

  getOption = () => {
    const option = {
      backgroundColor: '#264a69',
      title: {
        text: '全国主要城市空气质量',
        subtext: 'data from PM25.in',
        sublink: 'http://www.pm25.in',
        x: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} (p / km2)',
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
      },
      visualMap: {
        min: 800,
        max: 50000,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered'],
        },
      },
      series: [
        {
          name: 'pm2.5',
          type: 'map',
          mapType: '黑龙江', 
          itemStyle: {
            normal: { label: { show: true } },
            emphasis: { label: { show: true } },
          },
          data: [
            { name: '牡丹江市', value: 20057.34 },
            { name: '哈尔滨市', value: 15477.48 },
            { name: '齐齐哈尔市', value: 31686.1 },
            { name: '佳木斯市', value: 6992.6 },
            { name: '大庆市', value: 44045.49 },
          ],
        },
      ],
    };
    return option;
  }

  render() {
    return (
      <div className="examples">
        <div className="parent">
          <ReactEcharts
            option={this.getOption()}
            style={{ height: '500px', width: '100%' }}
            className="react_for_echarts"
          />
        </div>
      </div>
    );
  }
}
