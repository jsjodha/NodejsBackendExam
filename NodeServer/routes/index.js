var express = require('express');
var router = express.Router();
var auth = require('./auth');
var meetings = require('./meetings')
var util = require('util');
var user = require('./users');
var counters = require('./counters');
/*
router.post('/login', auth.login);
router.post('/logout', auth.logout);
*/
/* Meetings routes */
/*
router.get('/api/meetings', meetings.getAllmeetings);
router.get('/api/meeting/:id', meetings.getmeeting);
router.post('/api/meeting/', meetings.create);
router.put('/api/meeting/:id', meetings.update);
router.delete('/api/meeting/:id', meetings.delete);
 */

/* Routes for Administrations */
/**
router.get('/api/admin/users', user.getAllUsers);
router.get('/api/admin/user/:id', user.getuser);
router.post('/api/admin/user/', user.create);
router.put('/api/admin/user/:id', user.update);
router.delete('/api/admin/user/:id', user.delete);
 */

var routes = [];
routes.push({ method: 'POST', url: '/api/login', callback: auth.login });
routes.push({ method: 'POST', url: '/api/logout', callback: auth.logout });

routes.push({ method: 'GET', url: '/api/meetings', callback: meetings.getAllmeetings })
routes.push({ method: 'GET', url: '/api/meeting/:id', callback: meetings.getmeeting });
routes.push({ method: 'POST', url: '/api/meeting', callback: meetings.create });
routes.push({ method: 'PUT', url: '/api/meeting/:id', callback: meetings.update });
routes.push({ method: 'DELETE', url: '/api/meeting/:id', callback: meetings.delete });

routes.push({ method: 'GET', url: '/api/admin/users', callback: user.getAllUsers })
routes.push({ method: 'GET', url: '/api/admin/user/:id', callback: user.getuser });
routes.push({ method: 'POST', url: '/api/admin/user', callback: user.create });
routes.push({ method: 'PUT', url: '/api/admin/user/:id', callback: user.update });
routes.push({ method: 'DELETE', url: '/api/admin/user/:id', callback: user.delete });

routes.push({ method: 'GET', url: '/api/admin/counters', callback: counters.get });
routes.push({ method: 'POST', url: '/api/admin/counter/reset', callback: counters.reset });
routes.push({ method: 'GET', url: '/api/admin/requests', callback: counters.getAllReq });

var authenticator = require('../service/requestvalidator');
module.exports = function(req, res, next) {
    //randome timeout for 3rd party simulation.
    global.Api_PendingRequests += 1;
    counters.get();
    counters.addReq(req, res);
    var timeout = Math.floor((Math.random() * 10) + 1) * 100;
    setTimeout(invokeHandler, timeout, req, res, next);
}

function invokeHandler(req, res, next) {
    var handler = findroute(req.method, req.url);
    try {
        if (handler != null && handler != undefined) {
            var rs = handler.callback(req, res, next);
            res.json(rs);
            var timetaken = Date.now() - req._startTime;
            counters.update(timetaken);
        } else {
            var err = new Error('Not Found. invalid API call');
            err.status = 404;
            next(err);
        }
    } catch (err) {
        console.log('Some Error During Call.' + err);
    }
}



function findroute(method, url) {
    for (var i = 0; i < routes.length; i++) {
        if (method == 'DELETE' || method == 'PUT') {
            var ourl = routes[i].url;
            if (ourl.indexOf(":") > 0 && url.startsWith(ourl.substr(0, ourl.indexOf(':'))) && routes[i].method == method) {
                return routes[i];
            }
        } else if ((routes[i].orignalUrl == url || routes[i].url == url) && routes[i].method == method)
            return routes[i];
    }
}