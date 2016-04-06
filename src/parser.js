'use strict';

const fs = require('fs');
const path = require('path');

var parser = {};

parser.parse = function(dir, reg, savedir) {
    let files = fs.readdirSync(dir);

    if (!reg instanceof RegExp) {
        console.log('不是正则');
        return;
    }
    let links = [];
    let filepath = path.join(savedir, Date.now() + 'link.txt');

    let stream = fs.createWriteStream(filepath, {
        flag: 'a'
    });

    function step(resolve, reject) {
        for (let f of files) {
            let data = fs.readFileSync(path.join(dir, f), {
                encoding: 'utf8'
            });
            if (data.match(reg)) {
                links = data.match(reg);
                stream.write(links.join('\n') + '\n', 'utf8');
            }
            //同步写入会有重复, stream是更好的选择
        }

        stream.end();

        //事件触发了才返回是不可行的, 换用promise
        stream.on('finish', () => {
            resolve(fs.readFileSync(filepath, 'utf8').split('\n'));
        })
    }

    return new Promise(step);
}


module.exports = parser;