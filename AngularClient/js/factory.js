myApp.factory('meetingFactory', function($http) {
    var urlBase = 'http://localhost:9090/api/meetings';
    var _meetingsFactory = {};

    _meetingsFactory.getMeetings = function() {
        return $http.get(urlBase);
    };

    return _meetingsFactory;
});


myApp.factory('usersFactory', function($http) {
    var urlBase = 'http://localhost:9090/api/admin/users';
    var _usersFactory = {};
    debugger;
    _usersFactory.getAllUsers = function() {
        return $http.get(urlBase);
    };

    return _usersFactory;
});