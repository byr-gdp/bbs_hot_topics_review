var log = require('../utility/log');

setInterval(function(){
  var random = ['gold', 'silver', 'copper', 'hello', 'world', 'gdp'];
  log(random[Math.floor(Math.random() * random.length)]);
}, 3000);
