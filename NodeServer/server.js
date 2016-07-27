var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyparser = require('body-parser');

var app = express();

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

app.all('/api/*',[require('./service/requestvalidator')]);

app.use('/',require('./routes'));

app.use(function(req,res,next){
    var err = new Error('Not Found.');
    err.status = 404;
    next(err);
});

app.set('port', process.env.PORT || 9090);

var server = app.listen(app.get('port'), function()
{
    console.log('Server is started at port '+ server.address().port);
})