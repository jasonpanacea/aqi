import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import 'echarts/extension/bmap/bmap';
import { Spin, Card, Icon, Button } from 'antd';

import BaseStore from '../stores/BaseStore';

import '../styles/WholeCountry.less';


@withRouter
@observer
export default class WholeCountry extends React.Component {

  constructor(props) {
    super(props);
    BaseStore.fetchList();
    this.state = {
      cardVisible: false,
    };
    this.changeCenter = true;
    this.locateCenter = [104.114129, 37.550339];
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.changeCenter) {
      this.center = nextProps.center;
      this.zoomLevel = nextProps.zoomLevel;
    } else {
      this.changeCenter = true;
    }
  }


  getOption = (center = [104.114129, 37.550339], zoomLevel = 5) => {
    const option = {
      title: {
        text: '全国主要城市AQHI',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: 
          function format(val) {
            if (zoomLevel <= 6) {
              return `${val.value[4]} ${val.value[2]}`;
            }
            return `${val.value[5]} ${val.value[2]}`;
          }, 
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
          name: 'AQI',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: BaseStore.data,
          label: {
            normal: {
              formatter: 
                function format(val) {
                  return '';
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
                // return '#e4f33e';
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
    this.center = [center.lng, center.lat];
    this.zoomLevel = bmap.getZoom();
  }

  click = (params) => {
    console.log(params);
    this.changeCenter = false;
    this.locateCenter = [params.value[0], params.value[1]];
    this.cityname = params.name;
    this.cityValue = params.value;
    this.setState({ cardVisible: true });
  }

  closeCard = () => {
    this.setState({ cardVisible: false });
    this.changeCenter = false;
  }

  locate = () => {
    console.log(this.locateCenter);
    const echarts_instance = this.echarts_react.getEchartsInstance();
    echarts_instance.setOption(this.getOption(this.locateCenter, 12));
  }

  render() {
    const onEvents = {
      bmapRoam: this.bmapRoam,
      click: this.click,
    };

    // if (!BaseStore.ready) {
    //   return (
    //     <div>
    //       <Spin size="large" />
    //     </div>
    //   );
    // }
    return (
      <div className="map">
        <ReactEcharts
          ref={(e) => { this.echarts_react = e; }}  
          option={this.getOption(this.center, this.zoomLevel)}
          style={{ height: '650px', width: '100%' }}
          className="react_for_echarts"
          onEvents={onEvents}
        />
        { this.state.cardVisible &&
        <Card 
          title={this.cityname} 
          extra={<Icon type="close-circle" onClick={this.closeCard} />} 
          style={{ width: 400, position: 'fixed', right: '20px', bottom: '10px', zIndex: 99999, opacity: 0.9 }}
          actions={[<Button icon="environment" onClick={this.locate}>地图定位</Button>, <Button icon="select" onClick={() => { this.props.history.push(`/city/${this.cityname}`); }}>查看详情</Button>]}
        >
          <p>{this.cityValue[3]}</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      }
      </div>
    );
  }
}
