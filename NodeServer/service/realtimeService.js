var event = require('events');
var evt = new event();


var Realtime = function RealTime() {
    console.log('Realtime Constructor called.');
};

Realtime.prototype.Init = function(sio, server, callback) {
    sio.call(this);
    sio = sio;
    console.log(typeof(sio));
    sio.listen(server).on('connection', function(socket) {
        console.log('socket connected by' + socket.id);
        callback();
        // socket.on('MeetingCreated', function (msg) {
        //   console.log('Message Received: ', msg);
        //   socket.broadcast.emit('message', msg);
        // });
    });
    console.log('realtime initializaton.');
};
Realtime.prototype.invoke = function(type, data) {
    console.log(type + ' ' + data);
    console.log(typeof(this.sio));
    this.sio.emit(type, data);
};
Realtime.prototype.onInvoke = function(type, data, callback) {
    console.log(type + ' ' + data.toString());
    sio.on(type, data);
    callback(data);
};
module.exports = Realtime;