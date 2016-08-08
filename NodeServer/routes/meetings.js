const lowdb = require('lowdb');
var evt = require('events').EventEmitter();
const db = lowdb();

db.defaults({
    meetings: [
        { MeetingId: 1, CalendarId: 1123, StartTime: Date.now(), Duration: 30, StartDate: Date.now(), CreatedBy: "admin", subject: "meeting with J S" }
    ]
}).value();

module.exports = {
    getAllmeetings: function(req, res, next) {
        var rs = [];
        if (req.urole == 'admin') {
            rs = db.get('meetings').value();
        } else {
            db.get('meetings').value().filter(function(item) {
                if (item.CreatedBy == req.uname)
                    rs.push(item);
            })
        }
        return rs;
    },
    getmeeting: function(req, res) {
        var meeting = db.get('meetings').find({ MeetingId: parseParam(req) }).value();

        return meeting;
    },
    create: function(req, res) {
        var startTime = req.reqStartTime;
        var met = req.body;
        var lastVal = db.get('meetings').last().value();
        met.MeetingId = lastVal.MeetingId + 1;
        met.CalendarId = lastVal.CalendarId + 1;
        met.CreatedBy = req.uname;
        var result = db.get('meetings').push(met).last().value();
        global.sio.emit('MeetingCreated', result);
        return result;
    },
    update: function(req, res) {
        var met = req.body;
        met.MeetingId = parseParam(req);
        met.updTime = Date.now();
        var val = db.get('meetings')
            .find({ MeetingId: met.MeetingId })
            .assign(met)
            .value();
        global.sio.emit('MeetingUpdated', val);
        return val;

    },
    delete: function(req, res) {
        var met = req.body;
        met.MeetingId = parseParam(req);
        met.updTime = Date.now();
        var result = db.get('meetings')
            .remove({ MeetingId: met.id })
            .value();
        var deleted = {
            id: met.MeetingId,
            message: 'Meeting id ' + met.MeetingId + ' deleted.'
        };
        global.sio.emit('MeetingDeleted', deleted);

        return deleted;
    }
}

function parseParam(req) {
    var param = req.params[0];
    return parseInt(param.substr(param.lastIndexOf('/') + 1, param.length));
}