'use strict';

const fs = require('fs');
const path = require('path');

var parser = {};

/**
 * 从文件夹中解析并获得links, 同时把链接保存在文件中
 * 
 * @param {string} dir - The directory of html files
 * @param {RegExp} reg - Use for parse links
 * @param {string} savedir - The directory to save the links file
 * 
 * @return {Promise} - the promise return links
 */
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

        //事件触发了才返回是不可行的, 换用promise
        stream.on('finish', () => {
            resolve(fs.readFileSync(filepath, 'utf8').split('\n'));
        });
        
        stream.end();
    }

    return new Promise(step);
}


module.exports = parser;