'use strict';

const fs = require('fs');
const path = require('path');

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
