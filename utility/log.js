var fs = require('fs');
var moment = require('moment-timezone');

var log_dir = './log/';

var log = function(msg){
  //content string
  var content = moment().tz("Asia/Shanghai").format().slice(0, 19) + ': ' + msg + '\n';
  var log_file_path = log_dir + moment().tz("Asia/Shanghai").format().slice(0, 10) + '.log';
  //appendFile
  fs.appendFile(log_file_path, content, function(err){
    if(err){
      throw err;
    }
  });
}

module.exports = log;
