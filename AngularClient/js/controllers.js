myApp.controller("HeaderCtrl", ['$scope', '$location', 'UserAuthFactory',
    function($scope, $location, UserAuthFactory) {

        $scope.isActive = function(route) {
            return route === $location.path();
        }

        $scope.logout = function() {
            UserAuthFactory.logout();
        }
    }
]);
var socket = io('http://localhost:9090');
myApp.controller("HomeCtrl", ['$scope',
    function($scope) {
        $scope.name = "Home Controller";
    }
]);


myApp.controller("usersCtrl", ['$scope','usersFactory',
    function($scope, usersFactory) {
        $scope.name = "Admin Controller";

        debugger;
        $scope.Users = [];
        usersFactory.getAllUsers().then(function(data) {
            $scope.Users = data.data;
        });
        socket.on('usrCreated', function(data) {
            debugger;
            console.log(data);
            $scope.Users.push(data);
            $scope.$apply();
        });

        socket.on('usrUpdated', function(data) {
            debugger;
            $scope.meetiUsersngs[(data.id - 1)] = data;
            $scope.$apply();
        });
        socket.on('usrDeleted', function(data) {
            debugger;
            $scope.Users.splice((data.id - 1), 1);
            $scope.$apply();
        });
    }
]);

myApp.controller("MeetingsCtrl", ['$scope', 'dataFactory',
    function($scope, dataFactory) {
        $scope.meetings = [];
        dataFactory.getMeetings().then(function(data) {
            $scope.meetings = data.data;
        });
        socket.on('MeetingCreated', function(data) {
            debugger;
            console.log(data);
            $scope.meetings.push(data);
            $scope.$apply();
        });

        socket.on('MeetingUpdated', function(data) {
            debugger;
            $scope.meetings[(data.id - 1)] = data;
            $scope.$apply();
        });
        socket.on('MeetingDeleted', function(data) {
            debugger;
            $scope.meetings.splice((data.id - 1), 1);
            $scope.$apply();
        });
    }
]);