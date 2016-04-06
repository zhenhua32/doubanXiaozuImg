#doubanXiaozuImg

就是豆瓣小组图片下载器

##必备
node.js

##安装
npm inistall

好吧, 其实依赖项没用上太多, 一个是解码的,
豆瓣是通用的utf8, 又不是gbk, 用不上

另一个是解析cookie的, 好吧, 还没到那一步呢,
这爬虫只是简单的设置了 user-agent

##修改参数
* 修改根目录下的 **go.js** 文件

go.js 文件关键是定义下载文件所在的位置,
默认是在根目录下的 new 目录下, 这是一个空目录

需要修改的是第14行和第23行, 修改为一样的路径, 
路径应该是一个目录

需要注意的, 默认情况下是下载量是豆瓣小组的页数的十分之一,
可以修改第22行的0.1

* 修改文档目录下的 **小组.txt** 文件

小组.txt是用来识别豆瓣小组, 需要三行数据, 分别是
* 豆瓣小组的链接
* 豆瓣小组的名字(暂时未用上)
* 豆瓣小组的页数

注意: 这个文件是用`\r\n`来分隔的, 所以linux的用户请小心
或许该用path.delimiter分隔

多平台经验不多

##运行
node go.js

---
linux后台运行

nohup node go.js &

windows下用exit退出putty, 不要直接点叉叉关闭,
不然进程不会在后台继续运行

查看进程
ps -A

实时进程
top

http://linuxtools-rst.readthedocs.org/zh_CN/latest/tool/ps.html

---
所有的都是写给未来的自己看的

---

把程序扔给github就不用担心丢失了

##关于速度
豆瓣限制同一IP频繁访问, 所以速度很慢,
大概是一分钟10-20次https

**运行实测是一小时1200次https**

豆瓣全站启用了https, 用的是spdy3.1协议

至于分布式, 不了解

最简单的分布式就是发动群众, 可能也是最难的,
比起机器而言

##更新
version 1.0.1
* 修复parser.parse可能造成的内存泄漏
* parser.parse现在返回promise
