'use strict';

const fs = require('fs');
const path = require('path');

var helper = {};

//是异步的
helper.mkdir = function (path) {
    fs.stat(path, function (err, stats) {
        //文件夹不存在, 则创建
        if (err) {
            if (err.code === 'ENOENT') {
                fs.mkdirSync(path);
            } else {
                throw err;
            }
        }
        else {
            //路径存在, 但不是文件夹, 删除后创建
            if (!stats.isDirectory()) {
                fs.unlinkSync(path);
                fs.mkdirSync(path);
            }
        }
    });
};

helper.mkdirPromise = function (path) {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (err, stats) {
            //文件夹不存在, 则创建
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.mkdirSync(path);
                    resolve('good');
                } else {
                    reject(err);
                }
            }
            else {
                //路径存在, 但不是文件夹, 删除后创建
                if (!stats.isDirectory()) {
                    fs.unlinkSync(path);
                    fs.mkdirSync(path);
                    resolve('good');
                }
            }
        });
    })
};

//不通用, 只是删除目录下的所有文件, 不包括文件夹
helper.cleardir = function (dir) {
    var files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {

        let status = fs.statSync(path.join(dir, files[i]));

        if (status.isFile()) {
            fs.unlinkSync(path.join(dir, files[i]));
        }
    }
}


module.exports = helper;