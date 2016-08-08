var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyparser = require('body-parser');
var app = express();
var util = require('util');
var http = require("http").Server(app);
var socketio = require('socket.io');
var authenticator = require('./service/requestvalidator');

var router = require('./routes');

app.use(logger('combined'));
app.use(bodyparser.json());

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
//intercept all call comming to Api route.
app.all('/api/*', function(req, res, next) {
    console.log('intercepting every call to api route.' +
        '\r\n  StartTime:' + req._startTime +
        '\r\n  Method:' + req.method +
        '\r\n  url:' + req.url +
        '\r\n  body:' + req.body);
    global.Api_TotalRequestsReceived += 1; 
    next();

}, function(req, res, next) {
    return authenticator(req, res, next);
}, router);


app.set('port', process.env.PORT || 9090);

var server = app.listen(app.get('port'), function() {
    console.log('Server is started at port ' + server.address().port);
    global.sio = socketio.listen(server);
    global.sio.on('connection', function(socket) {
        console.log('Client connected with ' + socket.id);
    });
});