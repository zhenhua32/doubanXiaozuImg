'use strict';

const run = require('./src/run.js');
const fs = require('fs');
const path = require('path');

var data = fs.readFileSync('./文档/小组.txt', {
    encoding: 'utf8'
})

var infos = data.split('\r\n');
console.log(infos.length);

var base = './new/out';

var promises = [];

for (let i = 0; i < infos.length; i = i + 3) {
    base = base + i / 3;
    console.log(base);
    fs.mkdirSync(base);
    promises.push(run(base, infos[i], Math.ceil(infos[i + 2] * 0.1)));
    base = './new/out';
}

// base = base +  0;
// console.log(base);
// fs.mkdirSync(base);
// run(base, infos[0], Math.ceil(infos[2] * 0.1));

// console.log(promises[0]);

// promises[0]().then(
//     function(val) {
//         return promises[1]();
//     }
// )

var master = [];
master[0] = promises[0]();
for (let i = 1; i < promises.length; i++) {
  master[i] = master[i-1].then(promises[i]);
};

// promises.reduce(function(previousValue, currentValue, index, array) {
//     console.log(previousValue)
//     return previousValue.then(currentValue);
// })
//     .then(function() {
//         console.log('job finished');
//     });

