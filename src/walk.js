'use strict';

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

//重新包装 http 和 https 模块
var walk = {};

var options = {
    protocol: 'http:',
    hostname: 'localhost',
    port: 80,
    method: 'GET',
    path: '/',
    headers: {
        // 'Connection': 'keep-alive',
        // 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        // 'accept-encoding': 'gzip, deflate, sdch',
        // 'accept-language': 'zh-CN, zh;q=0.8',
        // 'cache-control': 'no-cache',
        // 'pragma': 'no - cache',
        // 'upgrade-insecure-requests': '1',
        // 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36',

        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'
    }
}

//合并对象, 用后一个覆盖前一个
function merge(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

walk.request = function(urlString, headers) {
    if (typeof urlString !== 'string') {
        console.log('walk.request的第一个参数不是string')
        return 1;
    }
    let URL = urlString.trim().toLowerCase();
    if (!URL.match(/^(http|https):\/\/.+/))
        URL += 'http://';

    let op = url.parse(URL);
    options.protocol = op.protocol;
    options.hostname = op.hostname;
    options.path = op.path;
    //如果port不在url里, op.port会是null, 不会有默认设置
    options.port = op.port ? op.port : options.port;

    options.headers = headers ? merge(options.headers, headers) : options.headers;

    if (op.protocol === 'http:') {
        return http.request(options);
    } else if (op.protocol === 'https:') {
        //必须重新设置
        options.port = 443;

        return https.request(options);
    }
}

walk.downhtml = function(request, dir) {
    let filepath = path.join(dir, Date.now() + '.html');
    let header = null;

    request.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    //only once
    request.on('response', (response) => {
        if (response.statusCode < 299) {
            //TODO@响应头中不一定有charset=gbk
            let encode = 'utf8';
            if (response.headers['content-type'].includes('gbk')) encode = 'gbk';

            response.pipe(iconv.decodeStream(encode))
                .pipe(iconv.encodeStream('utf8'))
                .pipe(fs.createWriteStream(filepath));

            header = response.headers;
        } else {
            console.log(response.statusCode);
            response.resume();
        }
    });
    //这个 return 没什么用
    request.on('close', () => {
        return true;
    });

    request.end();
}

walk.downimg = function(request, dir) {
    let filepath = path.join(dir, Date.now() + '.jpg');
    request.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    request.on('response', (response) => {
        if (response.statusCode < 299) {
            response.pipe(fs.createWriteStream(filepath));
        } else {
            console.log(response.statusCode);
            response.resume();
        }
    });
    request.on('close', () => {
        return true;
    });
    request.end();
}

module.exports = walk;

//TODO
//应该做个日志文件
//引入编码模块解析gbk
//https支持
//使用promise
//回调蛋疼
