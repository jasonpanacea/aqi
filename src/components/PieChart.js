import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class PieChart extends React.Component {
  getPieOption = () => {
    const option = {        
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
            option={this.getPieOption()}
            className="react_for_echarts"
          />
        </div>
      </div>
    );
  }


}
