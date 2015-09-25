var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs=require('fs');
var cfg=require('./config.js');
var gcfg=path.join(path.dirname(__dirname),'config.js');

var domain = require('domain');
var Domain = domain.create();
Domain.on( 'error', function( e ){    //监听异步错误
    console.log( 'error ' + e)
});

if(fs.existsSync(gcfg)){
    cfg=require(gcfg);
}

exports.cfg=cfg;
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            filename: path.join(path.dirname(__filename),'/bin/logs/access.log'),
            backups: 3,
            maxLogSize: 20480,
            category: 'normal'
        }
    ],
    replaceConsole: true
});

//var logger = log4js.getLogger('normal');
//logger.setLevel('INFO');
exports.logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel(cfg.logLevel||'ERROR');
    return logger;
}
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(log4js.connectLogger(this.logger('normal'),{level:'auto',format:':method :url'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var bookstore = require('./routes/bookstore');
app.use('/', bookstore);
var sns = require('./routes/sns');
app.use('/', sns);
var user = require('./routes/user');
app.use('/', user);
var freeflow = require('./routes/freeflow');
app.use('/', freeflow);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if(err.status==404){
            res.render('404',{query:req.query,path: req.path});
        }else {
            res.render('error', {
                message: err.message,
                error: err,
                path: req.path
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if(err.status==404){
        res.render('404',{query:req.query,path: req.path});
    }else{
        res.render('error', {
            message: err.message,
            error: {},
            path: req.path
        });
    }
});

module.exports = app;
