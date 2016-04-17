'use strict';

const makelink = require('./makelink.js');
const walk = require('./walk.js');
const parser = require('./parser.js');
const fs = require('fs');
const path = require('path');

var run = {};

/**
 * 下载链接, 区分html或img
 * 
 * @param {Array<string>} links - The links array to download
 * @param {string} dir - The directory to save html or img
 * @param {boolean} isimg - if true download img, else html
 * 
 * @returns {Promise}
 * 
 */
run.download = function (links, dir, isimg) {
    function download(resolve, reject) {
        for (let i = 0; i < links.length - 1; i++) {
            //skip null link
            if (!links[i]) continue;
            console.time(i + ' link=');
            setTimeout(function () {
                let req = walk.request(links[i]);
                isimg ? walk.downimg(req, dir) : walk.downhtml(req, dir);
                console.timeEnd(i + ' link=');
            }, (Math.ceil(Math.random() * 3) + i * 3) * 1000);
        }

        setTimeout(function () {
            //if null skip
            if (links[links.length - 1]) {
                let req = walk.request(links[links.length - 1]);
                isimg ? walk.downimg(req, dir) : walk.downhtml(req, dir);
            };
            resolve('good');
        }, ((links.length + 5) * 3) * 1000);
    }

    return new Promise(download);
}

/**
 * 从文件夹中解析获得links, 简单的调用 parser.js
 * 
 * @param {string} dir - The directory of html files
 * @param {base} dir - The directory to save the links file 
 * @param {RegExp} reg - Use for parse links
 * 
 * @returns {Promise} - the promise return links
 */
run.parse = function (dir, base, reg) {

    function parse(resolve, reject) {
        parser.parse(dir, reg, base).then(
            function (val) {
                //return links
                resolve(val);
            }
        )
    }

    return new Promise(parse);
}


//尼玛大闭包不会啊
/** 
 * 三个参数, 分别是
 * 基本路径b
 * 初始链接i
 * 生成链接数
 */
run.run = function (b, i, l) {

    let inital_links = null;
    let topic_path = null;
    let specific_links = [];
    let specific_path = null;
    let img_links = [];
    let img_path = null;

    //获取
    function step1(resolve, reject) {
        console.log('inital links ' + inital_links.length);
        for (let i = 0; i < inital_links.length - 1; i++) {
            console.time(i + ' topic=');
            if (!inital_links[i]) continue;
            setTimeout(function () {
                let req = walk.request(inital_links[i]);
                walk.downhtml(req, topic_path);
                console.timeEnd(i + ' topic=');
            }, (Math.ceil(Math.random() * 3) + i * 3) * 1000);
        }

        setTimeout(function () {
            let req = walk.request(inital_links[inital_links.length - 1]);
            walk.downhtml(req, topic_path);
            resolve('good');
        }, ((inital_links.length + 10) * 3) * 1000);
    }

    function step2(resolve, reject) {
        let reg = /https:\/\/www.douban.com\/group\/topic\/(\d)+\//ig;

        parser.parse(topic_path, reg, base).then(
            function (val) {
                specific_links = val;
                resolve('good');
            }
        )
    }

    function step3(resolve, reject) {
        console.log('specific links ' + specific_links.length);
        for (let i = 0; i < specific_links.length - 1; i++) {
            if (!specific_links[i]) continue;
            console.time(i + ' specific=');
            setTimeout(function () {
                let req = walk.request(specific_links[i]);
                walk.downhtml(req, specific_path);
                console.timeEnd(i + ' specific=');
            }, (Math.ceil(Math.random() * 3) + i * 3) * 1000);
        }

        setTimeout(function () {
            let req = walk.request(specific_links[specific_links.length - 1]);
            walk.downhtml(req, topic_path);
            resolve('good');
        }, ((specific_links.length + 10) * 3) * 1000);
    }

    function step4(resolve, reject) {
        let reg = /https:\/\/img1.doubanio.com\/view\/group_topic\/large\/public\/p(\d)+\.jpg/ig;

        parser.parse(specific_path, reg, base).then(
            function (val) {
                img_links = val;
                resolve('good');
            }
        )
    }

    function step5(resolve, reject) {
        console.log('img links ' + img_links.length);
        for (let i = 0; i < img_links.length - 1; i++) {
            if (!img_links[i]) continue;
            console.time(i + ' img=');
            setTimeout(function () {
                let req = walk.request(img_links[i]);
                walk.downimg(req, img_path);
                console.timeEnd(i + ' img=');
            }, (Math.ceil(Math.random() * 3) + i * 3) * 1000);
        }

        setTimeout(function () {
            let req = walk.request(img_links[img_links.length - 1]);
            walk.downimg(req, img_path);
            resolve('good');
        }, ((img_links.length + 3) * 3) * 1000);
    }

    let base = null;
    let inital = null;
    let length = 0;


    base = b;
    inital = i.trim() + 'discussion?start=';
    length = l;
    //生成初始链接
    inital_links = makelink(inital, length, base);
    topic_path = path.join(base, '/topic');
    fs.mkdirSync(topic_path);

    specific_path = path.join(base, '/specific');
    fs.mkdirSync(specific_path);

    img_path = path.join(base, '/img/');
    fs.mkdirSync(img_path);

    //可能需要解耦, 运行了几天稳定性不太好
    return function () {
        return new Promise(step1).then(function (val) {
            return new Promise(step2);
        }).then(function (val) {
            return new Promise(step3);
        }).then(function (val) {
            return new Promise(step4);
        }).then(function (val) {
            return new Promise(step5);
        })
    };

}


module.exports = run;