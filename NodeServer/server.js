var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyparser = require('body-parser');
var app = express();
var util = require('util');
var http = require("http").Server(app);

var socketio = require('socket.io');

app.use(logger('dev'));
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

app.all('/api/*', [require('./service/requestvalidator')]);

app.use('/', require('./routes'));

app.use(function(req, res, next) {
    var err = new Error('Not Found.');
    err.status = 404;
    next(err);
});

app.set('port', process.env.PORT || 9090);

var server = app.listen(app.get('port'), function() {
    console.log('Server is started at port ' + server.address().port);
});

global.sio = socketio.listen(server);
global.sio.on('connection', function(socket) {
    console.log('at server.js connected by' + socket.id);
    // socket.on('MeetingCreated', function (msg) {
    //   console.log('Message Received: ', msg);
    //   socket.broadcast.emit('message', msg);
    // });
});

// var realtime = require('./service/realtimeService');
// const rt = new realtime();
// rt.Init(socketio, server, onReady);

function onReady() {
    console.log('ready to work.');
};

var counter = 1;
var Server = module.exports = {
    ctr: counter,
    sio: function(type, data) {
        this.socketio.sockets.broadcast.emit(type, data);
    },
    emitter: function(type, data) {
        console.log('emiting message');
        this.socketio.sockets.broadcast.emit(type, data);
    }
}