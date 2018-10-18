import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import _ from 'lodash';
import 'echarts/map/js/china.js';

import BaseStore from '../stores/BaseStore';
import ProvinceDetail from './ProvinceDetail';
import AQHITransformer from '../utils/AQHITransformer';


@withRouter
@observer
export default class ProvinceOverview extends React.Component {
  
  componentWillReceiveProps(nextProps) {
    BaseStore.fetchProvinceList(nextProps.date_unit, nextProps.date_str, nextProps.quality_unit);
  }

  getOption = () => {
    const option = {
      backgroundColor: '#264a69',
      title: {
        text: `全国主要城市${AQHITransformer.transformQualityUnitText(this.props.quality_unit)}`,
        x: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: `{b}<br/>${AQHITransformer.transformQualityUnitText(this.props.quality_unit)}: {c}`,
      },
      visualMap: {
        min: 0,
        max: _.max(BaseStore.provinceList.slice().map(x => x.value)),
        splitNumber: 5,
        precision: 0,
        color: ['#d94e5d', '#eac736', '#50a3ba'],
        textStyle: {
          color: '#fff',
        },
      },
      series: [
        {
          name: 'AQHI',
          type: 'map',
          mapType: 'china',
          roam: true, 
          itemStyle: {
            normal: { label: { show: true } },
            emphasis: { label: { show: true } },
          },
          data: BaseStore.provinceList.slice(),
        },
      ],
    };
    return option;
  }
  onClick = (params) => {
    if (params.name) { 
      this.props.history.push(`/province_detail/${params.name}/${this.props.quality_unit}`);
      BaseStore.fetchProvinceDetail(this.props.date_unit, this.props.date_str, this.props.quality_unit, params.name);
    }
  }
  render() {
    const onEvents = {
      click: this.onClick,
    };
    return (
      <ReactEcharts
        option={this.getOption()}
        style={{ height: '650px', width: '100%' }}
        onEvents={onEvents}
      />
    );
  }
}
