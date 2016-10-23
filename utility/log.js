var fs = require('fs');

var log = function(date, cnt, msg){
    //TODO: 模板字符串
    console.log(date + ': 第' + (cnt + 1) + '次请求 - ' + msg);
    return (date + ': 第' + (cnt + 1) + '次请求 - ' + msg + '\n');
}

// log(new Date(), 1, "success");

module.exports = log;
