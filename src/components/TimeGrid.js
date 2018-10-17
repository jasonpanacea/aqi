import React from 'react';
import { Row, Col, Radio, DatePicker, Table, Cascader, Button } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import WholeCountry from './WholeCountry';
import ProvinceOverview from './ProvinceOverview';
import CityCompare from './CityCompare';
import SubItemComponent from './SubItemComponent';
import '../styles/grid.less';

import RegionStore from '../stores/RegionStore';
import BaseStore from '../stores/BaseStore';

const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { Column } = Table;

@withRouter
@observer
export default class TimeGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date_unit: '小时',
      quality_unit: 'aqi',
      date_range_format: 'YYYY-MM-DD HH',
      date_range_show_time: { format: 'HH' },
      date_array: [],
      default_range: [moment().subtract(1, 'd'), moment()],
      date_range: [moment().subtract(1, 'd'), moment()],
      center: [104.114129, 37.550339],
      zoomLevel: 5,
      city1: '北京市',
      city2: '上海市',
      playing: false,
      selectedDateIndex: 0,
    };
  }

  componentWillMount() {
    let cur = moment().subtract(1, 'd');
    const end = moment();
    let count = 1;
    const date_array = [];
    while (cur.isBefore(end) || cur.isSame(end)) {
      date_array.push({ key: count, number: count, date_str: cur.format(this.state.date_range_format) });
      cur = cur.add(1, 'h');
      count += 1;
    }
    this.setState({
      date_array,
    });
  }

  onCityChange = (value, selectedOptions) => {
    if (selectedOptions.length === 0) {
      this.setState({
        center: [104.114129, 37.550339],
        zoomLevel: 5,
      });
      return;
    }
    this.setState({
      center: selectedOptions[selectedOptions.length - 1].center,
      zoomLevel: 12,
    });
  }

  onCity1Change = (value, selectedOptions) => {
    this.setState({ city1: selectedOptions[selectedOptions.length - 1].label });
  }

  onCity2Change = (value, selectedOptions) => {
    this.setState({ city2: selectedOptions[selectedOptions.length - 1].label });
  }

  onDateUnitChange = (e) => {
    this.setState({
      date_unit: e.target.value,
    });
    let unit = 'h';
    let start = moment().subtract(1, 'd');
    let date_range_format = 'YYYY-MM-DD HH';
    if (e.target.value === '小时') {
      this.setState({
        date_range_show_time: { format: 'HH' },
        date_range_format: 'YYYY-MM-DD HH',
        date_range: [moment().subtract(1, 'd'), moment()],
      });
      unit = 'h';
      start = moment().subtract(1, 'd');
      date_range_format = 'YYYY-MM-DD HH';
    } else if (e.target.value === '日') {
      this.setState({
        date_range_show_time: false,
        date_range_format: 'YYYY-MM-DD',
        date_range: [moment().subtract(30, 'd'), moment()],
      });
      unit = 'd';
      start = moment().subtract(30, 'd');
      date_range_format = 'YYYY-MM-DD';
    } else if (e.target.value === '月') {
      this.setState({
        date_range_show_time: false,
        date_range_format: 'YYYY-MM',
        date_range: [moment().subtract(12, 'M'), moment()],
      });
      unit = 'M';
      start = moment().subtract(12, 'M');
      date_range_format = 'YYYY-MM';
    }
    let cur = start;
    const end = moment();
    let count = 1;
    const date_array = [];
    while (cur.isBefore(end) || cur.isSame(end)) {
      date_array.push({ key: count, number: count, date_str: cur.format(date_range_format) });
      cur = cur.add(1, unit);
      count += 1;
    }
    this.setState({
      date_array,
      selectedDateIndex: 0,
    });
  }
  onQualityUnitChange = (e) => {
    this.setState({
      quality_unit: e.target.value,
    });
  }
  
  onDateChange = (dates, dateStrings) => {
    this.setState({ date_range: dates });
    const start = moment(dateStrings[0], this.state.date_range_format);
    const end = moment(dateStrings[1], this.state.date_range_format);
    let cur = start;
    let unit;
    if (this.state.date_unit === '小时') {
      unit = 'h';
    } else if (this.state.date_unit === '日') {
      unit = 'd';
    } else {
      unit = 'M';
    }
    let count = 1;
    const date_array = [];
    while (cur.isBefore(end) || cur.isSame(end)) {
      date_array.push({ key: count, number: count, date_str: cur.format(this.state.date_range_format) });
      cur = cur.add(1, unit);
      count += 1;
    }
    this.setState({
      date_array,
    });
  }

  renderContent = () => {
    if (this.props.location.pathname === '/country' || this.props.location.pathname === '/') {
      return <WholeCountry center={this.state.center} zoomLevel={this.state.zoomLevel} date_str={this.state.date_array[this.state.selectedDateIndex].date_str} date_unit={this.state.date_unit} quality_unit={this.state.quality_unit} />;
    } else if (this.props.location.pathname === '/province') {
      return <ProvinceOverview date_str={this.state.date_array[this.state.selectedDateIndex].date_str} date_unit={this.state.date_unit} quality_unit={this.state.quality_unit} />;
    } else if (this.props.location.pathname === '/citycompare') {
      return <CityCompare date_array={this.state.date_array.map(x => x.date_str)} city1={this.state.city1} city2={this.state.city2} date_unit={this.state.date_unit} />;
    }
  }

  renderSelectCity = () => {
    if (this.props.location.pathname === '/country' || this.props.location.pathname === '/') {
      return (
        <Col span={3}>
          <Cascader
            options={RegionStore.regions}
            expandTrigger="hover"
            placeholder="选择城市"
            popupClassName="popup"
            onChange={this.onCityChange} 
          />
        </Col>
      );
    }

    if (this.props.location.pathname === '/citycompare') {
      return (
        <Col span={8}>
          <Cascader
            options={RegionStore.regions}
            expandTrigger="hover"
            placeholder="选择城市"
            allowClear={false}
            popupClassName="popup"
            defaultValue={[this.state.city1]}
            onChange={this.onCity1Change} 
          />
          <Cascader
            options={RegionStore.regions}
            expandTrigger="hover"
            placeholder="选择城市"
            allowClear={false}
            popupClassName="popup"
            defaultValue={[this.state.city2]}
            onChange={this.onCity2Change} 
          />
        </Col>
      );
    }
  };

  setClassName = (record, index) => {
    return (index === this.state.selectedDateIndex ? 'selected-date-index' : '');
  }

  changePlayStatus = () => {
    if (this.state.playing) {
      this.setState({ playing: false });
      clearInterval(this.timer);
    } else {
      this.setState({ playing: true });
      this.timer = setInterval(
        () => this.play(),
        1000
      );
    }
  }

  play = () => {
    if (this.state.selectedDateIndex === this.state.date_array.length - 1) {
      clearInterval(this.timer);
      this.setState({ playing: false });
      return;
    }
    this.setState((prevState) => {
      return { selectedDateIndex: prevState.selectedDateIndex + 1 };
    });
  }

  render() {
    return (
      <div>
        <Row>
          {this.renderSelectCity()}
          <Col span={11}>
            <RadioGroup onChange={this.onDateUnitChange} value={this.state.date_unit} size="small">
              <Radio value={'小时'}>小时</Radio>
              <Radio value={'日'}>日</Radio>
              <Radio value={'月'}>月</Radio>
            </RadioGroup>
            <RangePicker style={{ maxWidth: '300px' }} onChange={this.onDateChange} defaultValue={this.state.default_range} value={this.state.date_range} format={this.state.date_range_format} showTime={this.state.date_range_show_time} />
            
          </Col>
          {
            this.props.location.pathname !== '/citycompare' && 
            <Col span={10}>
              <RadioGroup onChange={this.onQualityUnitChange} value={this.state.quality_unit} size="small">
                <Radio value={'aqi'}>AQHI</Radio>
                <Radio value={'pm25'}>{<SubItemComponent pollution="PM" sub="2.5" />}</Radio>
                <Radio value={'pm10'}>{<SubItemComponent pollution="PM" sub="10" />}</Radio>
                <Radio value={'so2'}>{<SubItemComponent pollution="SO" sub="2" />}</Radio>
                <Radio value={'no2'}>{<SubItemComponent pollution="NO" sub="2" />}</Radio>
                <Radio value={'o3'}>{<SubItemComponent pollution="O" sub="3" />}</Radio>
                <Radio value={'co'}>CO</Radio>
              </RadioGroup>
            </Col>
          }
        </Row>
        <Row style={{ marginTop: '20px' }}>
          {this.props.location.pathname !== '/citycompare' &&
          <Col span={3}>
            <Table 
              dataSource={this.state.date_array} 
              size="small" 
              bordered
              pagination={false}
              scroll={{ y: 600 }}
              rowClassName={this.setClassName}
              onRow={(record, index) => {
                return {
                  onClick: () => {
                    this.setState({ selectedDateIndex: index });
                  },
                };
              }}
            >
              <Column
                title={<Button type="primary" onClick={this.changePlayStatus} icon={this.state.playing ? 'pause-circle-o' : 'play-circle-o'} size="small" >监测时间点</Button>}
                align="center"
                dataIndex="date_str"
                key="date_str"
                width={50}
              />
            </Table>
          
          </Col>
        }
          <Col span={this.props.location.pathname === '/citycompare' ? 24 : 21}>{this.renderContent()}</Col>
        </Row>
      </div>        
        
    );
  }
}
