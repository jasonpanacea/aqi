import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { withRouter } from 'react-router-dom';

import 'echarts/map/js/china.js';

@withRouter
export default class ProvinceOverview extends React.Component {

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
      visualMap: {
        min: 100,
        max: 50000,
        text: ['High', 'Low'],
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered'],
        },
      },
      series: [
        {
          name: 'pm2.5',
          type: 'map',
          mapType: 'china',
          roam: true, 
          itemStyle: {
            normal: { label: { show: true } },
            emphasis: { label: { show: true } },
          },
          data: [
            { name: '黑龙江', value: 20057.34 },
            { name: '吉林', value: 15477.48 },
            { name: '辽宁', value: 31686.1 },
            { name: '内蒙古', value: 31686.1 },
          ],
        },
      ],
    };
    return option;
  }
  onClick = (params) => {
    console.log(params);
    this.props.history.push(`/province_detail/${params.name}`);
  }
  render() {
    const onEvents = {
      click: this.onClick,
    };
    return (
      <ReactEcharts
        option={this.getOption()}
        style={{ height: '600px', width: '100%' }}
        className="react_for_echarts"
        onEvents={onEvents}
      />
    );
  }
}
