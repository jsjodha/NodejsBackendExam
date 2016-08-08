const lowdb = require('lowdb');

//Use below line to persist data.
//const db = lowdb('./db/user.json');

//for in memory data.
const db = lowdb();


db.defaults({
    users: [
        { id: "1", updTime: Date.now(), name: 'admin', password: 'admin', role: 'admin' },
        { id: "2", updTime: Date.now(), name: 'demo', password: 'demo', role: 'user' },
        { id: "3", updTime: Date.now(), name: 'jodha', password: 'jodha', role: 'user' }
    ]
}).value();

var users = {

    getAllUsers: function(req, res) {
        var allUsers = [];
        if (req.urole == 'admin') {
            allUsers = db.get('users').value();
        } else {
            allUsers.push(db.get('users').find({ name: req.uname }).value());
        }
        return allUsers;
    },

    getuser: function(req, res) {
        var user = db.get('users').find({ id: parseParam(req) }).value();
        return user;
    },

    isvaliduser: function(uname, pass) {
        return db.get('users').find({ name: uname, password: pass }).value();
    },
    hasUser: function(username) {
        return db.get('users').find({ name: username }).value();
    },
    create: function(req, res) {
        var usr = req.body;
        var lastVal = db.get('users').last().value();
        usr.id = lastVal.id + 1;
        usr.updTime = Date.now();
        var user = db.get('users').push(usr).last().value();
        global.sio.emit('usrCreated', user);
        return user;
    },
    update: function(req, res) {
        var usr = req.body;
        usr.id = parseParam(req);
        usr.updTime = Date.now();
        var val = db.get('users')
            .find({ id: usr.id })
            .assign(usr)
            .value();
        global.sio.emit('usrUpdated', val);
        return val;

    },
    delete: function(req, res) {
        var id = parseParam(req);
        var val = db.get('users')
            .remove({ id: id })
            .value();

        var usrDeleted = {
            id: id,
            message: 'user id ' + id + ' deleted.'
        };
        global.sio.emit('usrDeleted', usrDeleted);
        return usrDeleted;
    }
};

function parseParam(req) {
    var param = req.params[0];
    return parseInt(param.substr(param.lastIndexOf('/') + 1, param.length));
}
module.exports = users;