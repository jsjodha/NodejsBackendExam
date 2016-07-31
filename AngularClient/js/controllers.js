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

myApp.controller("Home2Ctrl", ['$scope',
    function($scope) {
        $scope.name = "Home Controller";
    }
]);
myApp.controller("HomeCtrl", ['$scope', 'meetingsFactory',
    function($scope, meetingsFactory) {

        $scope.meetings = [];
        meetingsFactory.getMeetings().then(function(data) {
            $scope.meetings = data.data;
        });
        socket.on('MeetingCreated', function(data) {
            $scope.meetings.push(data);
            $scope.$apply();
        });
        socket.on('MeetingUpdated', function(data) {
            var index = findMeetingIndex(data);
            if (index) {
                $scope.meetings[index] = data;
                $scope.$apply();
            };
        });
        socket.on('MeetingDeleted', function(data) {
            var index = findMeetingIndex(data);
            if (index) {
                $scope.meetings[index] = data;
                $scope.$apply();
            }
        });

        function findMeetingIndex(data) {
            var index = -1;
            var data = $scope.meetings.filter(function(met) {
                if (met.id == data.id) {
                    return index;
                }
                index++;
            });
            return index;
        }
    }
]);


myApp.controller("UsersCtrl", ['$scope', 'usersFactory',
    function($scope, usersFactory) {
        $scope.name = "Admin Controller";
        $scope.Users = [];
        usersFactory.getAllUsers().then(function(data) {
            $scope.Users = data.data;
        });
        socket.on('usrCreated', function(data) {
            $scope.Users.push(data);
            $scope.$apply();
        });

        socket.on('usrUpdated', function(data) {
            var index = findUsersIndex(data);
            if (index) {
                $scope.Users[index] = data;
                $scope.$apply();
            }
        });
        socket.on('usrDeleted', function(data) {
            var index = findUsersIndex(data);
            if (index) {
                $scope.Users.splice(index, 1);
                $scope.$apply();
            }
        });

        function findUsersIndex(data) {
            var index = -1;
            var data = $scope.Users.filter(function(usr) {
                if (usr.id == data.id) {
                    return index;
                }
                index++;
            });
            return index;
        }
    }
]);