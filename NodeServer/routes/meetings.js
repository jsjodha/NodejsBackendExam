const lowdb = require('lowdb');

const db = lowdb('./db/meetings.json');

db.defaults({
    meetings: [
        { id: "1", name: "meeting name", from: Date.now(), to: Date.now() + 1, description: 'something need to be done in this meeting' }
    ]
}).value();

const meetingsdb = db.get('meetings');



/* HACK to simulate thirdparty callback which can take time to respond. */
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

//var realtime = require('../service/realtimeService');
//var rt = new realtime();
//rt.invoke('testing', 'somedata');

var Meeting = function Meeting(sio, server, callback) {
    console.log('typeof sio is ' + typeof(sio));
    this.sio = sio;
    console.log('typeof server is ' + typeof(server));
    this.server = server;
    callback();
};

module.exports = {
    getAllmeetings: function(req, res) {
        var alldata = meetingsdb.value();
        res.json(alldata);
    },
    getmeeting: function(req, res) {
        var meeting = meetingsdb.find({ id: req.params.id }).value();
        res.json(meeting);
    },
    create: function(req, res) {
        var met = req.body;
        met.id = meetingsdb.__wrapped__.meetings.length + 1;
        met.updTime = Date.now();
        var result = meetingsdb.push(met).last().value();
        res.json(result);

        global.sio.emit('MeetingCreated', result);
    },
    update: function(req, res) {
        var met = req.body;
        //temp hack 
        met.id = req.params.id;
        met.updTime = Date.now();
        var val = meetingsdb.find({ id: req.params.id })
            .assign(met)
            .value();
        global.sio.emit('MeetingUpdated', val);
        res.json(val);

    },
    delete: function(req, res) {
        var met = req.body;
        //temp hack 
        met.id = req.params.id;
        met.updTime = Date.now();
        var result = meetingsdb.remove({ id: met.id })
            .value();

        var deleted = {
            id: req.params.id,
            message: 'Meeting id ' + req.params.id + ' deleted.'
        };
        global.sio.emit('MeetingDeleted', deleted);
        res.json(deleted);
    }
}