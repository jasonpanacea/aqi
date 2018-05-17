import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class FifthComponent extends React.Component {

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
      <div className="examples">
        <div className="parent">
          <ReactEcharts
            option={this.getLineOption()}
            style={{ height: '500px', width: '100%' }}
            className="react_for_echarts"
          />
          <ReactEcharts
            option={this.getBarOption()}
            style={{ height: '500px', width: '100%' }}
            className="react_for_echarts"
          />
          <ReactEcharts
            option={this.getPieOption()}
            style={{ height: '500px', width: '100%' }}
            className="react_for_echarts"
          />
        </div>
      </div>
    );
  }
}
