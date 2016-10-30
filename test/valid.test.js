var valid = require('../utility/valid');

console.log(valid('2016-10-30T16:56:10+08:00'));
console.log(valid('2016-10-30T01:56:10+08:00'));
console.log(valid('2016-10-30T23:56:10+08:00'));
console.log(valid('2016-10-30T01:05:10+08:00'));
