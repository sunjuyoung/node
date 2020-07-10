var nconf = require('nconf');
nconf.env();

console.log("os 환경변수 %s",nconf.get('OS'));