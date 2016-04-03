'use strict';

const fs = require('fs');
const path = require('path');

var parser = {}

parser.parse = function(dir, reg, savedir) {
    let files = fs.readdirSync(dir);
    
    if (!reg instanceof RegExp) {
        console.log('不是正则');
        return;
    }
    let links = [];

    for (let f of files) {
        let data = fs.readFileSync(path.join(dir, f), {
            encoding: 'utf8'
        });
        if (data.match(reg))
            links = links.concat(data.match(reg));
    }

    let filepath = path.join(savedir, Date.now() + 'link.txt');
    fs.writeFileSync(filepath, links.join('\n'), {
        encoding: 'utf8',
        flag: 'a'
    });

    return links;
}


module.exports = parser;