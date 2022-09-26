const dofilters = {
  //搜索字符串内的数字并返回浮点数字
  numbersFilter: function(value) {
      const reg = RegExp(/\d+/g);
      //let realVal = reg.exec(value);
      var realVal = reg.exec(value);
      //console.log(realVal);
      return parseFloat(realVal);
  },

}
export default dofilters;