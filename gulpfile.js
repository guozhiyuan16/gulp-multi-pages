const { src,dest,watch,series,parallel } = require("gulp");
const browserSync = require('browser-sync').create();

const del = require('del')
const minHTML = require('gulp-htmlmin');
const md5 = require('gulp-md5-plus');

// css
const Minifycss = require('gulp-minify-css');   // 压缩css
const Less = require('gulp-less');              // 编译less
const Autoprefixer = require('gulp-autoprefixer');  // 浏览器前缀

// js
const named = require('vinyl-named');
const webpack = require('webpack'); // 如果用独立的webpack 可以传 第二个参数
const gulpWebpack = require('webpack-stream');
// const rename = require('gulp-rename'); // rename后会有bug（gulp-rev-collector解析不了文件地址了）

// image
const Imagemin = require('gulp-imagemin');
const Pngquant = require('imagemin-pngquant');  //png图片压缩插件
const Cache = require('gulp-cache'); 

const webpackCfg = require('./webpack.config');

const compilerHtml = () => {
    return src('src/*.html')
        // .pipe(minHTML({
        //     collapseWhitespace: true, // 压缩html
        //     removeComments: true ,// 删除注释
        //     collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        //     removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        //     removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        //     removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        // }))
        .pipe(dest('dist'))
        .pipe(browserSync.reload({stream:true}))
}

const compilerCss = () => {
    return src('src/css/**')
        .pipe(Less())
        .pipe(Autoprefixer({
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(Minifycss({   // 压缩css
            //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            advanced: true,
            //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            compatibility: '',
            //类型：Boolean 默认：false [是否保留换行]
            keepBreaks: false,
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀        
            keepSpecialComments: '*'
        }))
        .pipe(dest('dist/css'))
        .pipe(md5(10,'./dist/*.html',{
            mappingFile: 'manifest.json',
            connector: '.'
        }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.reload({stream:true}))
}

const compilerImg = () => {
    return src('src/img/*')
        .pipe(Cache(Imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [Pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(dest('dist/img'));
}

const compilerJs = () => {
    return src('src/js/*.js')
        .pipe(named())
        .pipe(gulpWebpack(webpackCfg),webpack)
        // .pipe(rename(path=> path.basename += ".min"))  // https://segmentfault.com/q/1010000005044375
        .pipe(dest('dist/js'))
        .pipe(md5(10, './dist/*.html' , {
            mappingFile: 'manifest.json',
            connector: '.'
        }))
        .pipe(dest('dist/js'))
        .pipe(browserSync.reload({stream:true}))
}

const watchCompiler = () => {
    browserSync.init({
        server:'./dist',
        open: false,
        ui: false
    })

    watch('src/*.html',{delay:500},compilerHtml)
    watch('src/js/*.js',{delay:500},compilerJs)
    watch('src/css/*.css',{delay:500},compilerCss)
}

exports.default = series(compilerHtml,compilerCss,compilerJs,compilerImg,watchCompiler);