var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyparser = require('body-parser');
var app = express();
var util = require('util');
var http = require("http").Server(app);

app.use(logger('dev'));
app.use(bodyparser.json());


app.all('/CalenderApi/*', [require('./service/requestvalidator')]);

app.use('/', require('./routes'));

app.use(function(req, res, next) {
    var err = new Error('Not Found.');
    err.status = 404;
    next(err);
});

app.set('port', process.env.PORT || 9595);

var server = app.listen(app.get('port'), function() {
    console.log('Calender Server is started at port ' + server.address().port);
});
