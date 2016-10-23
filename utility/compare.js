var md5 = require('md5');

var compare = function(latest_data, current_data){
  for(var i in latest_data){
    var flag = false
    for(var j in current_data){
      //比较 url
      if(latest_data[i].link === current_data[j].link){
        // console.log(latest_data[i].link + '|||' + current_data[j].link);
        if(md5(latest_data[i].description) === md5(current_data[j].description)){
          //相同无变化
          flag = true;
          break;
        }else{
          //update
          return true;
        }
      }else{

      }
    }
    //no url match
    //update
    if(!flag){
      return true;
    }
  }
  return false;
}

module.exports = compare;
