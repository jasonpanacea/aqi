import React from 'react';
import { observer } from 'mobx-react';
import { Radio, RangePicker } from 'antd';

import BaseStore from '../stores/BaseStore';

const RadioGroup = Radio.Group;


export default class TimeGrid extends React.Component {
  state = {
    date_unit: '小时',
    quality_unit: 'AQI',
  }
  onDateUnitChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      date_unit: e.target.value,
    });
  }
  onQualityUnitChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      quality_unit: e.target.value,
    });
  }
  onDateChange = (dates, dateStrings) => {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  render() {
    return (
      <div>
        <RadioGroup onChange={this.onDateUnitChange} value={this.state.date_unit}>
          <Radio value={'小时'}>小时</Radio>
          <Radio value={'日'}>日</Radio>
          <Radio value={'月'}>月</Radio>
        </RadioGroup>
        <RadioGroup onChange={this.onQualityUnitChange} value={this.state.quality_unit}>
          <Radio value={'AQI'}>AQI</Radio>
          <Radio value={'PM2.5'}>PM2.5</Radio>
          <Radio value={'PM10'}>PM10</Radio>
          <Radio value={'SO2'}>SO2</Radio>
          <Radio value={'NO2'}>NO2</Radio>
          <Radio value={'O3'}>O3</Radio>
          <Radio value={'CO'}>CO</Radio>
        </RadioGroup>
        <RangePicker onChange={onDateChange} format={'YYYY-MM-DD HH'} showTime={{ format: 'HH' }} />
      </div>
    );
  }
}
