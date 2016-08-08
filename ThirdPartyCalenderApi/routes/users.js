const lowdb = require('lowdb');

const db = lowdb();

db.defaults({
    users: [
        { id: "1", updTime: Date.now(), name: 'admin', password: 'admin', role: 'admin' },
        { id: "2", updTime: Date.now(), name: 'demo', password: 'demo', role: 'user' },
        { id: "3", updTime: Date.now(), name: 'jodha', password: 'jodha', role: 'admin' }
    ]
}).value();
db.write();
var users = {

    getAllUsers: function(req, res) {
        var allUsers = db.get('users').value();
        res.json(allUsers);
    },

    getuser: function(req, res) {
        var user = db.get('users').find({ id: req.params.id }).value();
        res.json(user);
    },

    isvaliduser: function(uname, pass) {

        return db.get('users').find({ name: uname, password: pass }).value();
    },
    hasUser: function(username) {
        return db.get('users').find({ name: username }).value();
    },
    create: function(req, res) {
        var usr = req.body;
        usr.id = db.__wrapped__.users.length + 1;
        usr.updTime = Date.now();
        var user = db.get('users').push(usr).last().value();
        global.sio.emit('usrCreated', user);
        res.json(user);
    },
    update: function(req, res) {
        var usr = req.body;
        usr.id = req.params.id;
        usr.updTime = Date.now();
        var val = db.get('users')
            .find({ id: usr.id })
            .assign(usr)
            .value();
        global.sio.emit('usrUpdated', val);
        res.json(val);

    },
    delete: function(req, res) {
        var val = db.get('users')
            .remove({ id: req.params.id })
            .value();

        var usrDeleted = {
            id: req.params.id,
            message: 'user id ' + req.params.id + ' deleted.'
        };
        global.sio.emit('usrDeleted', usrDeleted);
        res.json(usrDeleted);
    }
};

module.exports = users;