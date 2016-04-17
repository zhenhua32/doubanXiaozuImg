'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 生成链接, 同时把链接保存在文件 initallink.txt 中
 * 
 * @param {string} inital - The link of douban xiaozu
 * - https://www.douban.com/group/351977/discussion?start=
 * @param {number} length - The number of links
 * @param {string} savedir - The directory where the file save
 * @param {number} [startfrom=0] - Where is the link start
 * 
 * @returns {Array<string>}
 */
module.exports = function(inital, length, savedir, startfrom) {
    let links = [];
    
    let start = 0;
    
    if(typeof startfrom === 'number') start = startfrom;
    
    for(let i = 0; i<length; i++) {
        links.push(inital+(start+i*25));
    }
    
    let filepath = path.join(savedir, 'initallink.txt');   
    fs.writeFileSync(filepath, links.join('\n'), {
        encoding: 'utf8',
        flag: 'a'
    });
    
    return links;
}
