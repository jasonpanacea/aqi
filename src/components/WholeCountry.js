import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { observer } from 'mobx-react';
import 'echarts/extension/bmap/bmap';
import { Spin } from 'antd';

import BaseStore from '../stores/BaseStore';

@observer
export default class WholeCountry extends React.Component {

  constructor(props) {
    super(props);
    BaseStore.fetchList();
  }

  getOption = (center = [104.114129, 37.550339], zoomLevel = 5) => {
    const convertData = function (data) {
      const res = [];
      for (let i = 0; i < data.length; i++) {
        res.push({
          name: data[i].city,
          value: [data[i].longitude, data[i].latitude, data[i].pm25, data[i].quality],
        });
      }
      return res;
    };
 
    const option = {
      title: {
        text: '全国主要城市空气质量 - 百度地图',
        subtext: 'data from PM25.in',
        sublink: 'http://www.pm25.in',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      bmap: {
        center,
        zoom: zoomLevel,
        roam: true,
        mapStyle: {
          styleJson: [{
            featureType: 'water',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1',
            },
          }, {
            featureType: 'land',
            elementType: 'all',
            stylers: {
              color: '#f3f3f3',
            },
          }, {
            featureType: 'railway',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          }, {
            featureType: 'highway',
            elementType: 'all',
            stylers: {
              color: '#fdfdfd',
            },
          }, {
            featureType: 'highway',
            elementType: 'labels',
            stylers: {
              visibility: 'off',
            },
          }, {
            featureType: 'arterial',
            elementType: 'geometry',
            stylers: {
              color: '#fefefe',
            },
          }, {
            featureType: 'arterial',
            elementType: 'geometry.fill',
            stylers: {
              color: '#fefefe',
            },
          }, {
            featureType: 'poi',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          }, {
            featureType: 'green',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          }, {
            featureType: 'subway',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          }, {
            featureType: 'manmade',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1',
            },
          }, {
            featureType: 'local',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1',
            },
          }, {
            featureType: 'arterial',
            elementType: 'labels',
            stylers: {
              visibility: 'off',
            },
          }, {
            featureType: 'boundary',
            elementType: 'all',
            stylers: {
              color: '#fefefe',
            },
          }, {
            featureType: 'building',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1',
            },
          }, {
            featureType: 'label',
            elementType: 'labels.text.fill',
            stylers: {
              color: '#999999',
            },
          }],
        },
      },
      series: [
        {
          name: 'pm2.5',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: convertData(BaseStore.detail.rows),
          label: {
            normal: {
              formatter: 
                function format(val) {
                  if (zoomLevel <= 6) {
                    return '';
                  }
                  return val.value; 
                }, 
              position: 'right',
              show: true,
            },
            emphasis: {
              show: true,
            },
          },
          itemStyle: {
            normal: {
              color(val) {
                if (val.data.value[3] === '优良') {
                  return '#32f43e';
                } else if (val.data.value[3] === '良') {
                  return '#e4f33e';
                } else if (val.data.value[3] === '轻度污染') {
                  return '#e4993c';
                } else if (val.data.value[3] === '中度污染') {
                  return '#f60003';
                } else if (val.data.value[3] === '重度污染') {
                  return '#9f034c';
                } else if (val.data.value[3] === '严重污染') {
                  return '#800025';
                }
              },
            },
          },
        },
      ],
    };
    return option;
  };
    
  bmapRoam = (params) => {
    const echarts_instance = this.echarts_react.getEchartsInstance();
    const bmap = echarts_instance.getModel().getComponent('bmap').getBMap();
    const center = bmap.getCenter();
    echarts_instance.setOption(this.getOption([center.lng, center.lat], bmap.getZoom()));
  }

  render() {
    const onEvents = {
      bmapRoam: this.bmapRoam,
    };

    if (!BaseStore.ready) {
      return (
        <div>
          <Spin size="large" />
        </div>
      );
    }
    return (
      <div className="examples">
        <div className="parent">
          <ReactEcharts
            ref={(e) => { this.echarts_react = e; }}  
            option={this.getOption()}
            style={{ height: '600px', width: '100%' }}
            className="react_for_echarts"
            onEvents={onEvents}
          />
        </div>
      </div>
    );
  }
}
