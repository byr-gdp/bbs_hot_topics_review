var fetch = require('node-fetch');
var cheerio = require('cheerio');
var fs = require('fs');
var shell = require('shelljs');
var moment = require('moment-timezone');

var log = require('./utility/log');
var compare = require('./utility/compare');
var valid = require('./utility/valid');

var data_dir = './data/';

//处理原始xml数据，并生成待写入文件的字符串。
var process_source_xml = function(res){
  var $ = cheerio.load(res, {
    xmlMode: true
  });
  var items = [];
  $('item').each(function(i, e) {
    var title = $(e).find('title').text().trim();
    var link = $(e).find('link').text().trim();
    var author = $(e).find('author').text().trim();
    var pubDate = $(e).find('pubDate').text().trim();
    var description = $(e).find('description').text().trim().replace(/&nbsp;/g, '');
    items.push({
      title: title,
      author: author,
      link: link,
      pubDate: pubDate,
      description: description
    });
  });
  return items;
};

//读取文件
var load_data_file = function(file_path){
  try{
    return fs.readFileSync(file_path, 'utf8');
  }catch(err){
    log('读取文件失败，可能是该文件不存在');
    log(err);
    return -1;
  }
};

setTimeout(function(){
  var now = moment().tz('Asia/Shanghai').format();
  if(valid(now)){
    var file_path = data_dir + now.slice(0, 10) + '.json';
    fetch('https://bbs.byr.cn/rss/topten').then(function(res){
      return res.text();
    }).then(function(res){
      var latest_data = process_source_xml(res);
      console.log('suc');
      //TODO:读取当日文件
      var current_data = JSON.parse(load_data_file(file_path));
      if(current_data === -1){
        fs.writeFile(file_path, JSON.stringify(latest_data, null, 4), function(err){
          if(err){
            log('写入文件失败：新文件');
            log(err);
          }
          shell.exec('git add .; git commit -m "auto commit: new file ' + moment().tz('Asia/Shanghai').format() + '"; git push origin master;');
        });
      }else{
        log('读取文件成功');
        var flag = compare(latest_data, current_data);
	console.log(flag);
	console.log('git add .; git commit -m "auto commit: new file ' + moment().tz('Asia/Shanghai').format() + '"; git push origin master;');
        if(true){
          fs.writeFile(file_path, JSON.stringify(latest_data, null, 4), function(err){
            if(err){
              log('写入文件失败：主题发生变化');
              log(err);
            }
            shell.exec('git add .; git commit -m "auto commit: new change ' + moment().tz('Asia/Shanghai').format() + '"; git push origin master;');
          });
        }
      }
    });
  }else{
    log('非记录时间：' + now);
  }
}, 1 * 1 * 1000);
