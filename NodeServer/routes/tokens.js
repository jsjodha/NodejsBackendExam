const lowdb = require('lowdb');
var secrat = require('../config/secrat.js')();
var jwt = require('jwt-simple');
var userprovider = require('./users');
const db = lowdb('./db/tokens.json');

db.defaults({tokens :[]}).value();

var tokenprovider = {
    isValidToken: function(req, res, next) {
        var access_token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
      
        if (access_token ) {
            try {
                 var result = db.get('tokens').find({ token: access_token }).value();
                
                if (result.expires <= Date.now()) {
                    res.status(400);
                    res.json({
                        "status": 400,
                        "message": "toekn expired"
                    });
                    return;
                }
                
                next();
                
                /* validate users if they belongs to admin team. */
                /*var userfromData = db.get('tokens').find({ user.name: key }).value();              
                if (userfromData) {
                    if ((req.url.indexOf('admin') >= 0 && userfromData.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/') >= 0)) {
                        next();
                    } else {
                        res.status(403),
                            res.json({
                                "status": 403,
                                "message": "Not Authrized"
                            });
                        return;
                    }
                } else {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid User"
                    });
                    return;
                }
                */

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
    },
    create: function(req, res) {
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
            db.write();
            res.status(200);
            res.json({
                "status": 200,
                "tokendata": rs
            });
            return rs;
        }
    },
    delete: function(req, res) {
        var access_token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

        if (access_token || key) {
            try {
                var result = db.get('tokens').remove({
                    token: access_token
                }).value();
                db.write();
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

};


function genToken(user) {
    var expire = expireIn(1); //1 day to expire
    var token = jwt.encode({
        exp: expire
    }, require('../config/secrat.js')());

    return {
        createdAt: Date.now(),
        token: token,
        expires: expire,
        user: user
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