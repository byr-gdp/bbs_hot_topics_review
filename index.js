var fetch = require('node-fetch');
var cheerio = require('cheerio');
var fs = require('fs');
var shell = require('shelljs');
var moment = require('moment-timezone');

var log = require('./utility/log');
var compare = require('./utility/compare');

//处理原始xml数据，并生成待写入文件的字符串。
var process_source_xml = function(res){
  var $ = cheerio.load(res, {
    xmlMode: true
  });
  var items = [];
  $("item").each(function(i, e) {
    var title = $(e).find("title").text().trim();
    var link = $(e).find("link").text().trim();
    var author = $(e).find("author").text().trim();
    var pubDate = $(e).find("pubDate").text().trim();
    var description = $(e).find("description").text().trim().replace(/&nbsp;/g, "");
    items.push({
      title: title,
      author: author,
      link: link,
      pubDate: pubDate,
      description: description
    });
  });
  return items;
}

//读取文件
var load_data_file = function(){
  var file_name = moment().tz("Asia/Shanghai").format().slice(0, 10) + '.json';
  try{
    return fs.readFileSync(file_name, 'utf8');
  }catch(err){
    log(err);
    return -1;
  }
}

setInterval(function(){
  fetch("https://bbs.byr.cn/rss/topten").then(function(res){
    return res.text();
  }).then(function(res){
    var latest_data = process_source_xml(res);
    var file_name = moment().tz("Asia/Shanghai").format().slice(0, 10) + '.json';

    //TODO:读取当日文件
    var current_data = JSON.parse(load_data_file());
    if(current_data === -1){
      log('读取文件失败，可能是该文件不存在');
      fs.writeFile(file_name, JSON.stringify(latest_data, null, 4), function(err){
        if(err){
          // console.log('error:' + err);
          log(err);
        }
        shell.exec('git add .; git commit -m "' + new Date().toJSON().slice(0, 10) + '"; git push origin master;');
      });
    }else{
      log('读取文件成功');
      var flag = compare(latest_data, current_data);
      if(flag){
        fs.writeFile(file_name, result, function(err){
          if(err){
            log(err)
          }
          log('十大话题发生变化');
          shell.exec('git add .; git commit -m "' + moment().tz("Asia/Shanghai").format() + '.log;' + '"; git push origin master;');
        })
      }
    }
  });
}, 3000);
