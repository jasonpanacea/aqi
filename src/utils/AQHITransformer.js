class AQHITransformer {
  transfrom(aqhi) {
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
}
export { AQHITransformer };
export default new AQHITransformer();
