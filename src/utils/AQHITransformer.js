class AQHITransformer {
  transfromAQHI2Text(aqhi) {
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
  caculateAQHI(pm25, o3, beta = 0, ERMAX, city = '') {
    let alpha = 0.38;
    if (city === '北京市') { alpha = 0.46; } else if (city === '上海市') { alpha = 0.43; } else if (city === '广州市') { alpha = 0.9; }
    let aqhi = Math.pow(Math.E, alpha * pm25) - 1 + Math.pow(Math.E, beta * o3) - 1;
    aqhi /= ERMAX;
    return Math.round(aqhi * 10);
  }
}
export { AQHITransformer };
export default new AQHITransformer();
