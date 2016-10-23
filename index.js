var fetch = require('node-fetch');
var cheerio = require('cheerio');
var fs = require('fs');
var log = require('./utility/log');
var compare = require('./utility/compare');

var cnt = 1;

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
  var file_name = new Date().toJSON().slice(0, 10) + '.log';
  return fs.readFileSync(file_name, 'utf8');
}

setInterval(function(){
  fetch("https://bbs.byr.cn/rss/topten").then(function(res){
    return res.text();
  }).then(function(res){
    var latest_data = process_source_xml(res);
    var file_name = new Date().toJSON().slice(0, 10) + '.log';

    //TODO:读取当日文件
    var current_data = JSON.parse(load_data_file());

    var flag = compare(latest_data, current_data);
    if(flag){
      fs.writeFile(file_name, result, function(err){
        if(err){
          //log err
        }
        console.log("write successfully");
      })
    }else{
      //nothing to do
      console.log("no changes found");
    }
  });
}, 1000);
