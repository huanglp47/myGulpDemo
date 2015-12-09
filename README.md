# myGulpDemo<br> 
This is a demo for gulp <br> 
构建结果见图 gulp_result.png <br>
这是基于gulp的前端自动化工程demo，主要解决我们wap网站的以下问题：<br> 
1.静态资源压缩。<br> 
2. cdn加速及缓存解决。<br> 
3. 文件合并。<br> 

目前业界的最主流的解决方案有以下几种：<br> 
1.百度的fis前端工程化方案。<br> 
2.京东的jdf前端集成解决方案。<br> 
3.去哪儿的 fekit 前端自动化解决方案。<br> 
4.Gulp (或者grunt)及其插件。<br> 
5.webpack。<br> <br> 

但fis没有支持Java freeMarker 的解决方案（目前web后端是.ftl模板，admin是jsp,wap是基于nodejs的H5网站，模板是ejs。重构受到技术方案限制）；jdf只支持Java velocity模板。Webpack可以后续再用。目前，暂时采用gulp方案，先由WAP网站开始优化（本例只适合gulp构建，不是完整项目无法node运行~~~~）。<br> <br> 

工具：gulp（类似java的maven,ant...）及其插件。<br> 
环境：nodejs。<br> 
目标：<br> 
1.Js,css, 图片压缩（gulp-uglify，gulp-minify-css， gulp-imagemin）。<br> 
2.js,css公用文件进行合并（gulp-concat）。<br> 
2.前端资源路径替换（gulp-rev，gulp-rev-collector）。<br> 
3.静态资源cdn部署.（通过参数配置，实现本地开发与线上切换）。<br> 
4.cdn缓存处理（使用MD5替换，类似：a.js?v=sdf10de34）。<br> <br> 

具体：<br> 
请在node环境下安装gulp以及gulp插件：<br> <br> 

1.进入文件，在window 命令行输入：（推荐使用webstorm 10的Terminal）<br> 
npm install <br> 
由于不想静态资源服务器文件冗余，顾由a_sdf10de34.js改为a?v=sdf10de34，因此得修改gulp-rev,gulp-rev-collector两个插件源代码<br> <br> 

打开 node_modules\gulp-rev\index.js  <br> 
第143行 manifest[originalFile] = revisionedFile; <br> 
更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;<br> <br> 

打开 nodemodules\gulp-rev\nodemodules\rev-path\index.js<br> 
10行 return filename + '-' + hash + ext;<br> 
更新为: return filename + ext;<br> <br> 

打开 node_modules\gulp-rev-collector\index.js<br> 
31行 if ( path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !== path.basename(key) ) {<br> 
更新为: if ( path.basename(json[key]).split('?')[0] !== path.basename(key) ) {<br> <br> 

2.输入： gulp  <br> 
3.OK，构建结束 <br> <br> 

关于生产环境与开发环境的切换问题。通过config.js _cdnPrefix参数设置：<br> 
exports._cdnPrefix = 'http://hlpassets.demo.com';<br>   
![image](https://github.com/huanglp47/myGulpProject/blob/master/gulp_result.png)















