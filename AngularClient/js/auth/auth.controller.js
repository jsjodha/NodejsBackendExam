myApp.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
    function($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
        $scope.user = {
            username: 'admin',
            password: 'admin'
        };

        $scope.login = function() {

            var username = $scope.user.username,
                password = $scope.user.password;

            if (username !== undefined && password !== undefined) {
                UserAuthFactory.login(username, password).success(function(data) {
                    debugger;
                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.tokendata.user;
                    AuthenticationFactory.userRole = data.tokendata.role;

                    $window.sessionStorage.token = data.tokendata.token;
                    $window.sessionStorage.user = data.tokendata.user; // to fetch the user details on refresh
                    $window.sessionStorage.userRole = data.tokendata.role; // to fetch the user details on refresh

                        $window.sessionStorage.isAdmin =false;
                    if (data.tokendata.role == 'admin') {
                        $window.sessionStorage.isAdmin = true;
                    }
                    $location.path("/");

                }).error(function(status) {
                    debugger;
                    if (!status) { alert('Oops something went wrong!'); } else { alert(status.message); }
                });
            } else {
                debugger;
                alert('Invalid credentials');
            }

        };

    }
]);