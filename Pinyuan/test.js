// s = 'ssss';
// r = s.substring(0,2);
// console.log(s);
// console.log(r);
var nodejieba = require("nodejieba");
var result = nodejieba.cut("八百标兵奔北坡");
console.log(result);