class ProvinceNameUtil {
  formatProvinceName(name) {
    if (name === '建设兵团') { return '新疆'; }
    if (['宁夏', '广西', '西藏', '内蒙古'].indexOf(name) !== -1) { return name; }
    return name.substring(0, name.length - 1);
  }
}
export { ProvinceNameUtil };
export default new ProvinceNameUtil();
