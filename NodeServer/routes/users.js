const lowdb = require('lowdb');

const db = lowdb('./db/user.json');

db.defaults({users :[
            { id: "1", name: 'admin', password: 'admin', role:'admin' },
            { id: "2", name: 'demo', password: 'demo',role:'user' },
            { id: "3", name: 'jodha', password: 'jodha',role:'admin' }
        ]}).value();

var users = {

    getAllUsers: function (req, res) {
        var allUsers = db.get('users').value();
        res.json(allUsers);
    },

    getuser: function (req, res) {        
        var user = db.get('users').find({ id: req.params.id }).value();
        res.json(user);
    },

    isvaliduser: function (uname, pass) {
        
        return db.get('users').find({ name: uname, password: pass }).value();
    },
    hasUser: function(username){
        return db.get('users').find({name:username}).value();
    },
    create: function (req, res) {
         var l = db.get('users').value().length;        
         var user = db.get('users').push(req.body).last().value();
        res.json(user);
    },
    update: function (req, res) {        
        var val = db.get('users')
        .find({ id: req.params.id})
        .assign(req.body)
        .value();        
        res.json(val);
    },
    delete: function (req, res) {        
        var val = db.get('users')
        .remove({id: req.params.id})
        .value();
        res.json(val)
    }
};

module.exports =  users;