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
          AuthenticationFactory.user = data.tokendata.user.username;
          AuthenticationFactory.userRole = data.tokendata.user.role;

          $window.sessionStorage.token = data.tokendata.token;
          $window.sessionStorage.user = data.tokendata.user.username; // to fetch the user details on refresh
          $window.sessionStorage.userRole = data.tokendata.user.role; // to fetch the user details on refresh

          $location.path("/");

        }).error(function(status) {
          alert('Oops something went wrong!');
        });
      } else {
        alert('Invalid credentials');
      }

    };

  }
]);
