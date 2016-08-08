const lowdb = require('lowdb');

const db = lowdb();

db.defaults({
    calenders: [
        { CalendarId: 1, StartTime: Date.now(), Duration: 30, StartDate: Date.now(), subject: "Sample Calender" }
    ]
}).value();


/* HACK to simulate thirdparty callback which can take time to respond. */
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

module.exports = {
    getAll: function(req, res, next) {
        wait(1000);
        var rs = db.get('calenders').value();

        res.json(rs);
    },
    getmeeting: function(req, res) {
        wait(1000);
        var meeting = db.get('calenders').find({ CalendarId: req.params.CalendarId }).value();
        res.json(meeting);
    },
    create: function(req, res) {
        wait(2000);
        var met = req.body;
        var m = db.get('calenders').last().value();
        met.CalendarId = db.get('calenders').__wrapped__.calenders.length + 1;
        met.updTime = Date.now();
        var result = db.get('calenders').push(met).last().value();
        res.json(result);
    },
    update: function(req, res) {
        var met = req.body;
        met.CalendarId = req.params.CalendarId;
        met.updTime = Date.now();
        var val = db.get('calenders').find({ CalendarId: req.params.id })
            .assign(met)
            .value();
        res.json(val);

    },
    delete: function(req, res) {
        var met = req.body;
        //temp hack 
        met.CalendarId = req.params.CalendarId;
        met.updTime = Date.now();
        var result = db.get('calenders').remove({ CalendarId: met.CalendarId })
            .value();

        var deleted = {
            id: req.params.CalendarId,
            message: 'Calender id ' + req.params.CalendarId + ' deleted.'
        };

        res.json(deleted);
    }
}