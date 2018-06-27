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

  componentWillReceiveProps() {

  }
 
  getOption = (center = [], zoomLevel = 5) => {
    if (center.length === 0) {
      center = [104.114129, 37.550339];
    }
    const option = {
      title: {
        text: '全国主要城市AQHI',
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
            featureType: 'railway',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          }, {
            featureType: 'highway',
            elementType: 'labels',
            stylers: {
              visibility: 'off',
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
            featureType: 'arterial',
            elementType: 'labels',
            stylers: {
              visibility: 'off',
            },
          }, {
            featureType: 'label',
            elementType: 'labels.text.fill',
            stylers: {
              color: 'black',
            },
          }],
        },
      },
      series: [
        {
          name: 'pm2.5',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: BaseStore.data,
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
    
  bmapRoam = () => {
    if (this === null || this.echarts_react === null) {
      return;
    }
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
            option={this.getOption(this.props.center, this.props.zoomLevel)}
            style={{ height: '650px', width: '100%' }}
            className="react_for_echarts"
            onEvents={onEvents}
          />
        </div>
      </div>
    );
  }
}
