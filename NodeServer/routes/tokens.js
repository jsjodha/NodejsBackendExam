const lowdb = require('lowdb');
var secrat = require('../config/secrat.js')();
var jwt = require('jwt-simple');
var userprovider = require('./users');
const db = lowdb('./db/tokens.json');

db.defaults({ tokens: [] }).value();

var tokenprovider = {
    isValidToken: function(req, res, next) {
        if (req.url.indexOf('login') > 0) {
            login(req, res);
            return;
        } else if (req.url.indexOf("logout") > 0) {
            logout(req, res);
            return;
        }


        var access_token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        if (access_token) {
            try {
                var result = db.get('tokens').find({ token: access_token }).value();
                if (result == null || result == undefined) {
                    res.status(400);
                    res.json({ "status": 400, "message": "toekn expired" });
                    return;
                } else if (result.expires <= Date.now()) {
                    res.status(400);
                    res.json({
                        "status": 400,
                        "message": "toekn expired"
                    });
                    return;
                } /* if anything only need to be served to admim. */
                else if (req.url.indexOf('admin') >= 0) {
                    if (result.role != 'admin') {
                        res.status(403),
                            res.json({
                                "status": 403,
                                "message": "Not Authrized"
                            });
                        return;
                    } else {
                        req.uname = result.user;
                        req.urole = result.role;
                        next();
                    }
                } else {
                    req.uname = result.user;
                    req.urole = result.role;
                    next();
                }

            } catch (err) {
                res.status(500),
                    res.json({
                        "status": 500,
                        "message": "sorry something want wrong.",
                        "error": err
                    });
                return;
            }
        } else {
            res.status(401);
            res.json({
                "status": 401,
                "message": "given  Toek or Key is invalid. "
            });
            return;
        }
    }
}

function login(req, res) {
    var uname = req.body.username || '';
    var pass = req.body.password || '';
    if (uname == '' || pass == '') {
        res.status(401);
        res.json({
            "status": 401,
            "message": "UserName or Password is invalid."
        });
        return;
    }

    var dbuser = userprovider.isvaliduser(uname, pass);
    if (!dbuser) {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid credentials."
        });
        return;
    }
    if (dbuser) {
        var token = genToken(dbuser);
        var rs = db.get('tokens').push(token).last().value();
        res.status(200);
        res.json({
            "status": 200,
            "tokendata": rs
        });
        global.Api_activeUsers += 1;
        return rs;
    }
}

function logout(req, res) {
    var access_token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (access_token || key) {
        try {
            var result = db.get('tokens').remove({
                token: access_token
            }).value();
            if (!result) {
                result = db.get('tokens').remove({
                    user: uname
                }).value();
                return;
            } else {
                res.status(200);
                res.json({
                    "status": 200,
                    "message": "logout successful."
                });
                global.Api_activeUsers -= 1;
                return;
            }
        } catch (err) {
            res.status(500),
                res.json({
                    "status": 500,
                    "message": "sorry something want wrong.",
                    "error": err
                });
        }
    }
}


function genToken(user) {
    var expire = expireIn(1); //1 day to expire
    var token = jwt.encode({
        exp: expire
    }, require('../config/secrat.js')());

    return {
        createdAt: Date.now(),
        token: token,
        expires: expire,
        user: user.name,
        role: user.role
    };
}

function genExpireToken(user) {
    var expire = expireIn(-1); //1 day to expire
    var token = jwt.encode({
        exp: expire
    }, require('../config/secrat.js')());

    return {
        token: token,
        expires: expire,
        user: user
    };
}

function expireIn(numOfDay) {
    var objdate = new Date();
    return objdate.setDate(objdate.getDate() + numOfDay);
}

module.exports = tokenprovider;