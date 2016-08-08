myApp.factory('meetingsFactory', function($http, $window) {
    var urlBase = 'http://localhost:9090/api/';
    var _meetingsFactory = {};

    _meetingsFactory.getMeetings = function() {
        return $http.get(urlBase + 'meetings');
    };
    _meetingsFactory.cancelMeeting = function(calenderId) {
        return $http.delete(urlBase + 'meeting/' + calenderId);
    };
    _meetingsFactory.CreateMeetings = function(numbers) {
        var user = $window.sessionStorage.user;
        var numbs = numbers;
        debugger;
        setTimeout(function(user) {
            for (i = 0; i < numbs; i++) {
                setTimeout(function(user, index) {
                    var duration = Math.floor((Math.random() * 100) + 100);
                    var date = Date.now();
                    var data = {
                        StartTime: date,
                        Duration: duration,
                        StartDate: date,
                        CreatedBy: user,
                        subject: "random meeting generated at " + date
                    };
                    var rs = $http.post(urlBase + 'meeting', data);
                    console.log(rs);
                }, 0);
            }
        }, 3000);
    };
    return _meetingsFactory;
});


myApp.factory('usersFactory', function($http) {
    var urlBase = 'http://localhost:9090/api/admin/users';
    var _usersFactory = {};
    _usersFactory.getAllUsers = function() {
        debugger;
        return $http.get(urlBase);
    };
    return _usersFactory;
});



myApp.factory('countersFactory', function($http) {
    var urlBase = 'http://localhost:9090/api/admin/';
    var _countersFactory = {};
    _countersFactory.getCounters = function() {
        debugger;
        return $http.get(urlBase + 'counters');
    };
    _countersFactory.resetCounters = function() {
        debugger;
        return $http.post(urlBase + 'counter/reset', {});
    };
    _countersFactory.getAllRequests = function() {
        debugger;
        return $http.get(urlBase + 'requests');
    };
    _countersFactory.disableCounters = function() {
        debugger;
        return $http.get(urlBase + 'counter/disable');
    };
    _countersFactory.getActiveUsers = function() {
        debugger;
        return $http.get(urlBase + 'loginsessions');
    };

    return _countersFactory;
});