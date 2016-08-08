myApp.controller("HeaderCtrl", ['$scope', '$location', 'UserAuthFactory', '$window',
    function($scope, $location, UserAuthFactory, $window) {
        $scope.username = $window.sessionStorage.user;
        $scope.isAdmin = false;
        debugger;
        if ($window.sessionStorage.userRole == 'admin') {
            $scope.isAdmin = true;
        }
        $scope.isActive = function(route) {
            return route === $location.path();
        }

        $scope.logout = function() {
            UserAuthFactory.logout();
        }
    }
]);

var socket = io('http://localhost:9090');

myApp.controller("CountersCtrl", ['$scope', 'countersFactory',
    function($scope, countersFactory) {
        $scope.name = "Counters Controller";
        $scope.requests = [];
        $scope.PendingRequests = 0;
        $scope.TotalRequests = 0;
        $scope.avgTimeMS = 0;
        $scope.activeUsers = 0;
        $scope.LoginSessons = [];
        countersFactory.getCounters().then(function(data) {
            debugger;
            //data will send auto via events. 
        })
        $scope.resetCounters = function() {
            countersFactory.resetCounters().then(function(rs) {
                $scope.requests = [];
                $scope.LoginSessons = [];
                $scope.PendingRequests = 0;
                $scope.TotalRequests = 0;
                $scope.avgTimeMS = 0;
                $scope.activeUsers = 0;
                $scope.$apply();
            });
        };
        $scope.DisableCounters = function() {
            countersFactory.resetCounters().then(function(rs) {
                $scope.requests = [];
                $scope.LoginSessons = [];
                $scope.PendingRequests = 0;
                $scope.TotalRequests = 0;
                $scope.avgTimeMS = 0;
                $scope.activeUsers = 0;
                $scope.$apply();
            });
        };
        countersFactory.getAllRequests().then(function(rs) {
            $scope.requests = rs.data;
        })
        countersFactory.getActiveUsers().then(function(rs) {
            $scope.LoginSessons = rs.data;
        })

        socket.on('requestaddedd', function(data) {
            $scope.requests.push(data);
            $scope.$apply();
        });
        socket.on('TotalRequestsReceived', function(data) {
            $scope.TotalRequests = data;
            $scope.$apply();
        });
        socket.on('PendingRequests', function(data) {
            $scope.PendingRequests = data;
            $scope.$apply();
        });
        socket.on('avgTimeMS', function(data) {
            $scope.avgTimeMS = data;
            $scope.$apply();
        });
        socket.on('activeUsers', function(data) {
            $scope.activeUsers = data;
            $scope.$apply();
        });
        socket.on('loginSessions', function(data) {
            $scope.LoginSessons = data;
            $scope.$apply();
        });
    }
]);
myApp.controller("HomeCtrl", ['$scope', 'meetingsFactory',
    function($scope, meetingsFactory) {
        $scope.meetings = [];
        $scope.meetingsToCreate = 0;
        meetingsFactory.getMeetings().then(function(data) {
            debugger;
            $scope.meetings = data.data;
        });

        $scope.CreateMeetings = function() {
            debugger;
            var nums = $scope.meetingsToCreate;
            if (nums > 0) {
                meetingsFactory.CreateMeetings(nums);
            }
        }
        $scope.CancelMeetings = function(calenderId) {
            if (calenderId > 0) {
                meetingsFactory.cancelMeeting(calenderId).then(function(rs) {
                    var index = findMeetingIndex(data);
                    if (index) {
                        $scope.meetings[index] = data;
                        $scope.$apply();
                    }
                })
            }
        }

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
            var index = 0;
            debugger;
            var data = $scope.meetings.find(function(met) {
                if (met.CalendarId == data.id) {
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
        debugger;
        $scope.name = "User Management Controller";
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