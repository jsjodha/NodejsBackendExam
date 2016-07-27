const lowdb = require('lowdb');

const db = lowdb('./db/meetings.json');

db.defaults({meetings :[
            {id:"1",name:"meeting name", from:Date.now(),to:Date.now()+1,description:'something need to be done in this meeting'}
        ]}).value();

const meetingsdb = db.get('meetings');
var meetings = {

    getAllmeetings: function (req, res) {
        var alldata = meetingsdb.value();
        res.json(alldata);
    },
    getmeeting: function (req, res) {        
        var meeting =meetingsdb.find({id: req.params.id}).value();
        res.json(meeting);
    },
    create: function (req, res) {        
        var result = meetingsdb.push(req.body).last().value();
        res.json(result);
    },
    update: function (req, res) {
       var val = meetingsdb.find({id: req.params.id})
        .assign(req.body)
        .value();
        res.json(val);
    },
    delete: function (req, res) {
        var id = req.params.id;
        var result = meetingsdb.remove({id:req.params.id})
        .value();
        res.json(result);
    }
};

module.exports = meetings;
