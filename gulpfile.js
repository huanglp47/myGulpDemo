/**
 * Created by LiPeng Wong on 2015/9/17.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var utf8Convert = require('gulp-utf8-convert');
var revCollector = require('gulp-rev-collector');
var jshint=require('gulp-jshint');

var cfg= require('./config.js');
var _cdnPrefix = cfg._cdnPrefix;
var paths = {
    css: 'public/css/**/*.css',
    js: 'public/js/**/*.js',
    images: 'public/images/**/*'
};
//�﷨���
gulp.task('jshint', function () {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
//ѹ��js
gulp.task('compressJS', ['scripts'], function(){
    return gulp.src(paths.js)
        .pipe(uglify())
        .pipe(rev())//P.S:���޸�gulp-revԴ�룬������MD5!
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});
// �ϲ�ָ��js
gulp.task('scripts', function(){
    return  gulp.src(['public/js/lib/jquery-2.1.1.min.js', 'public/js/lib/sea.js', 'public/js/iscroll.js', 'public/js/common.js']) //���Ժϲ������ύ��cdn
        .pipe(concat('all_common.js'))
        .pipe(gulp.dest('public/js'))
});
//ѹ����ʽ
gulp.task('minifyCss',['concat'],  function () {
    return gulp.src(paths.css)
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});
//�ϲ�ָ��css
gulp.task('concat', function() {
    return gulp.src(['public/css/base.css', 'public/css/layout.css'])    //- ��Ҫ�����css�ļ����ŵ�һ���ַ���������
        .pipe(concat('all_common.css'))                            //- �ϲ�����ļ���
        .pipe(gulp.dest('public/css'))
});
// ѹ��ͼƬ
gulp.task('images', function () {
    return gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/images'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/images'));
});
// ���ݱ�����Զ��滻·��
gulp.task('rev', ['compressJS', 'minifyCss', 'images'], function () {
    return gulp.src(['rev/**/*.json', 'views_dev/**/*.ejs'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '/css/':_cdnPrefix + '/css/',
                '/js/': _cdnPrefix+'/js/',
                '/style/': '/style/',
                '/images/': function(manifest_value) {
                    return _cdnPrefix+'/images/'+ manifest_value;
                }
            }
        }) )
        .pipe(utf8Convert({  // ��ֹ����
            encNotMatchHandle:function (file) {
                console.log(file + " ���벻��ȷ�����޸ģ�");
            }
        }))
        .pipe( gulp.dest('views') );
});
//�Զ����js.css��images�仯
gulp.task('auto', function(event){
    console.log('type:' +event.type + 'path:'+event.path);
    gulp.watch(paths.js, ['compressJS','rev']);
    gulp.watch(paths.css, ['minifyCss','rev']);
    gulp.watch(paths.images, ['images','rev']);
});
// ���
gulp.task('clean', function(){
    gulp.src(['dist/', 'rev/','views/','public/js/all_common.js','public/css/all_common.css'], {read: false})
        .pipe(clean());
});
gulp.task('default',['clean'], function(){
    gulp.start('compressJS',  'minifyCss', 'images', 'rev', 'auto');
});
//gulp.task('default',[ 'compressJS',  'minifyCss', 'images', 'rev', 'auto']);