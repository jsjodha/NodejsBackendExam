const lowdb = require('lowdb');

const db = lowdb();

db.defaults({
    requests: [
        { method: "GET", url: "localhost:9090", startTime: Date.now(), body: {} }
    ]
}).value();
const newstate = { requests: [] };
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
        Api_PendingRequests -= 1;
        global.sio.emit('PendingRequests', Api_PendingRequests);
        Api_TotalRequestTime += timetaken;
        Api_avgTimeMS = Math.floor((Api_TotalRequestTime / Api_TotalRequestsReceived));
        global.sio.emit('avgTimeMS', Api_avgTimeMS);
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


}

function publishCounters() {
    global.sio.emit('TotalRequestsReceived', Api_TotalRequestsReceived);
    global.sio.emit('PendingRequests', Api_PendingRequests);
    global.sio.emit('avgTimeMS', Api_avgTimeMS);
    global.sio.emit('activeUsers', Api_activeUsers);
}