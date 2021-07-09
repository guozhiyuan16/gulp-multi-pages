const { src,dest,watch,series,parallel } = require("gulp");
const browserSync = require('browser-sync').create();
const minHTML = require('gulp-htmlmin');

const compilerHtml = () => {
    return src('src/*.html')
        .pipe(minHTML({
            collapseWhitespace: true, // 压缩html
            removeComments: true ,// 删除注释
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.reload({stream:true}))
}

const compilerCss = () => {
    return src('src/css/*.css')
        .pipe(dest('dist/css'))
        .pipe(browserSync.reload({stream:true}))
}

const compilerJs = () => {
    return src('src/js/*.js')
        .pipe(dest('dist/js'))
        .pipe(browserSync.reload({stream:true}))
}

const wathCompiler = () => {
    browserSync.init({
        server:'dist',
        open: 'external',
    })

    watch('src/*.html',{delay:500},compilerHtml)
    watch('src/js/*.js',{delay:500},compilerJs)
    watch('src/css/*.css',{delay:500},compilerCss)
}

exports.default = parallel(series(compilerJs,compilerCss),compilerHtml,wathCompiler);