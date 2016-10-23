var fs = require('fs');
var log = require('../utility/log');

//file_prefix, eg 2016-10-22
var date = new Date().toJSON().slice(0, 10);
var file_name = date + '.log';
var cnt = 0;

setInterval(function(){
  var append_data = log(new Date().toLocaleString(), cnt++, "msg");
  fs.appendFile(file_name, append_data, function(err){
    if (err) {
      throw err;
    }
  });
}, 1000);
