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
  caculateAQHI(pm25, o3, beta = 0.000546444, ERMAX = 0.19) {
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
  

}
export { AQHITransformer };
export default new AQHITransformer();
