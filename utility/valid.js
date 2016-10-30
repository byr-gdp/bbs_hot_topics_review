// 根据时间是否在 01:05 ~ 23:50 判断是否进行文件比较。

var min = 1 * 60 + 10;
var max = 23 * 60 + 50;

var valid = function(date){
  var time = date.slice(11, 19);
  var time_arr = time.split(":");
  var now = parseInt(time_arr[0] * 60) + parseInt(time_arr[1]);
  if(now < max && now > min){
    return true;
  }else{
    return false;
  }
}

module.exports = valid;
