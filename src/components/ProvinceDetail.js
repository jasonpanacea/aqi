import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import 'echarts/map/js/province/heilongjiang.js';
import 'echarts/map/js/province/jilin.js';
import 'echarts/map/js/province/liaoning.js';
import 'echarts/map/js/province/anhui.js';
import 'echarts/map/js/province/beijing.js';
import 'echarts/map/js/province/chongqing.js';
import 'echarts/map/js/province/fujian.js';

import 'echarts/map/js/province/gansu.js';
import 'echarts/map/js/province/guangdong.js';
import 'echarts/map/js/province/guangxi.js';
import 'echarts/map/js/province/guizhou.js';
import 'echarts/map/js/province/hainan.js';
import 'echarts/map/js/province/hebei.js';

import 'echarts/map/js/province/henan.js';
import 'echarts/map/js/province/hubei.js';
import 'echarts/map/js/province/hunan.js';
import 'echarts/map/js/province/jiangsu.js';
import 'echarts/map/js/province/jiangxi.js';
import 'echarts/map/js/province/neimenggu.js';

import 'echarts/map/js/province/ningxia.js';
import 'echarts/map/js/province/qinghai.js';
import 'echarts/map/js/province/shandong.js';
import 'echarts/map/js/province/shanghai.js';
import 'echarts/map/js/province/shanxi.js';
import 'echarts/map/js/province/shanxi1.js';

import 'echarts/map/js/province/sichuan.js';
import 'echarts/map/js/province/tianjin.js';
import 'echarts/map/js/province/xinjiang.js';
import 'echarts/map/js/province/xizang.js';
import 'echarts/map/js/province/yunnan.js';
import 'echarts/map/js/province/zhejiang.js';

import BaseStore from '../stores/BaseStore';
import AQHITransformer from '../utils/AQHITransformer';

@withRouter
@observer
export default class ProvinceDetail extends React.Component {

  getOption = () => {
    const option = {
      backgroundColor: '#264a69',
      title: {
        text: `${this.props.match.params.name}AQHI`,
        x: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: `{b}<br/>${this.props.match.params.quality_unit}: {c}`,
      },
      visualMap: {
        min: 0,
        max: AQHITransformer.getMaxValue(this.props.quality_unit),
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
          mapType: this.props.match.params.name, 
          roam: true, 
          itemStyle: {
            normal: { label: { show: true } },
            emphasis: { label: { show: true } },
          },
          data: BaseStore.provinceDetail.slice(),
        },
      ],
    };
    return option;
  };

  onClick = (params) => {
    this.props.history.push('/province');
  }
  render() {
    const onEvents = {
      click: this.onClick,
    };
    return (
      <div className="examples">
        <div className="parent">
          <ReactEcharts
            option={this.getOption()}
            style={{ height: '500px', width: '100%' }}
            className="react_for_echarts"
            onEvents={onEvents}
          />
        </div>
      </div>
    );
  }
}
