import React from 'react';
import SubItemComponent from '../components/SubItemComponent';

class AQHITransformer {
  transformAQHI2Text(aqhi) {
    if (aqhi <= 3) {
      return '低风险';
    } else if (aqhi <= 6) {
      return '中风险';
    } else if (aqhi <= 10) {
      return '高风险';
    } else {
      return '极高风险';
    }
  }
  caculateAQHI(pm25, o3, beta = 0.000546444, ERMAX = 0.1) {
    const alpha = 0.000138508197369495;
    let aqhi = Math.pow(Math.E, alpha * pm25) - 1 + Math.pow(Math.E, beta * o3) - 1;
    aqhi /= ERMAX;
    return Math.round(aqhi * 10);
  }

  transformQualityUnitReactNode(quality, prefix = '') {
    if (quality === 'aqi') { 
      return `${prefix}AQHI`; 
    } else if (quality === 'pm25') { 
      return <SubItemComponent pollution={`${prefix}PM`} sub="2.5" />; 
    } else if (quality === 'pm10') { 
      return <SubItemComponent pollution={`${prefix}PM`} sub="10" />; 
    } else if (quality === 'so2') { 
      return <SubItemComponent pollution={`${prefix}SO`} sub="2" />; 
    } else if (quality === 'no2') { 
      return <SubItemComponent pollution={`${prefix}NO`} sub="2" />; 
    } else if (quality === 'o3') { 
      return <SubItemComponent pollution={`${prefix}O`} sub="3" />; 
    } else if (quality === 'co') { 
      return `${prefix}CO`; 
    }
  }

  transformQualityUnitText(quality) {
    if (quality === 'aqi') { 
      return 'AQHI'; 
    } 
    if (quality === 'pm25') { 
      return 'PM2.5'; 
    } else {
      return quality.toUpperCase();
    }
  }

  getMaxValue(quality) {
    if (quality === 'aqi') { 
      return 10; 
    } if (quality === 'pm25') { 
      return 150; 
    } if (quality === 'pm10') {
      return 150; 
    } if (quality === 'so2') { 
      return 18; 
    } if (quality === 'no2') { 
      return 100; 
    } if (quality === 'co') { 
      return 2; 
    } if (quality === 'o3') { 
      return 200; 
    } 
  }

  getLabelColor(quality, val) {
    if (quality === 'aqi') {
      if (val === 1) { return '#58FA58'; }
      if (val === 2) { return '#31B404'; }
      if (val === 3) { return '#0B610B'; }
      if (val === 4) { return '#F3F781'; }
      if (val === 5) { return '#FFFF00'; }
      if (val === 6) { return '#D7DF01'; }
      if (val === 7) { return '#F78181'; }
      if (val === 8) { return '#FE2E2E'; }
      if (val === 9) { return '#610B0B'; }
      if (val === 10) { return '#3B0B0B'; }
    }
    const max = this.getMaxValue(quality);
    if (val <= max / 4) {
      return '#32f43e';
    }
    if (val <= max / 4 * 2) {
      return '#e4f33e';
    }
    if (val <= max / 4 * 3) {
      return '#f60003';
    } 
    return '#9f034c';
  }
  

}
export { AQHITransformer };
export default new AQHITransformer();
