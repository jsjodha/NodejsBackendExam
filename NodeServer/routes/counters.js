const lowdb = require('lowdb');

const db = lowdb();
const tokendb = lowdb();

db.defaults({
    requests: [
        { method: "GET", url: "localhost:9090", startTime: Date.now(), body: {} }
    ]
}).value();
const newstate = { requests: [] };
Api_CountersEnabled = true;
Api_TotalRequestsReceived = 0;
Api_PendingRequests = 0;
Api_TotalRequestTime = 0;
Api_avgTimeMS = 0;
Api_activeUsers = 0;

module.exports = {
    get: function() {
        publishCounters();
    },
    update: function(timetaken) {
        if (Api_CountersEnabled) {
            Api_PendingRequests -= 1;
            global.sio.emit('PendingRequests', Api_PendingRequests);
            Api_TotalRequestTime += timetaken;
            Api_avgTimeMS = Math.floor((Api_TotalRequestTime / Api_TotalRequestsReceived));
            global.sio.emit('avgTimeMS', Api_avgTimeMS);
        }
    },
    reset: function() {
        Api_TotalRequestsReceived = 0;
        Api_PendingRequests = 1; //as this updated after call and pushed to socket. 
        Api_TotalRequestTime = 0;
        Api_avgTimeMS = 0;
        Api_activeUsers = 0;
        db.setState(newstate);
        publishCounters();
        console.log('All admin counters are clear.');
    },
    disable: function(req, res) {
        this.reset();
        Api_CountersEnabled = false;
    },
    addReq: function(req, res) {
        var data = { method: req.method, url: req.url, startTime: Date.parse(req._startTime), body: req.body };
        var result = db.get('requests').push(data).last().value();
        global.sio.emit('requestaddedd', result);
        return result;
    },
    getAllReq: function(req, res) {
        var result = db.get('requests').value();
        return result;
    },
    getActiveUsers: function(req, res) {
        var tokens = GetTokens();
        Api_activeUsers = tokens.length;
        return tokens;
    },
}

function GetTokens() {
    var result = tokendb.get('tokens').value();
    return result;
}

function publishCounters() {
    if (Api_CountersEnabled) {
        global.sio.emit('TotalRequestsReceived', Api_TotalRequestsReceived);
        global.sio.emit('PendingRequests', Api_PendingRequests);
        global.sio.emit('avgTimeMS', Api_avgTimeMS);
        global.sio.emit('activeUsers', Api_activeUsers);
        global.sio.emit('loginSessions', GetTokens());
    }
}