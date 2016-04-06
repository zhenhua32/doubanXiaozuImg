'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 生成链接
 * @param {string} inital - The link of douban xiaozu
 * @param {number} length - The number of links
 * @param {string} savedir - The directory where the file save
 */
module.exports = function(inital, length, savedir) {
    let links = [];
    for(let i = 0; i<length; i++) {
        links.push(inital+i*25);
    }
    
    let filepath = path.join(savedir, 'initallink.txt');   
    fs.writeFileSync(filepath, links.join('\n'), {
        encoding: 'utf8',
        flag: 'a'
    });
    
    return links;
}
