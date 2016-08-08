myApp.factory('AuthenticationFactory', function($window) {
    var auth = {
        isLogged: false,
        check: function() {
            if ($window.sessionStorage.token && $window.sessionStorage.user) {
                this.isLogged = true;
            } else {
                this.isLogged = false;
                delete this.user;
            }
        }
    }

    return auth;
});

myApp.factory('UserAuthFactory', function($window, $location, $http, AuthenticationFactory) {
    return {
        login: function(username, password) {
            return $http.post('http://localhost:9090/api/login', {
                username: username,
                password: password
            });
        },
        logout: function() {

            if (AuthenticationFactory.isLogged) {
                AuthenticationFactory.isLogged = false;
                delete AuthenticationFactory.user;
                delete AuthenticationFactory.role;

                delete $window.sessionStorage.token;
                delete $window.sessionStorage.user;
                delete $window.sessionStorage.role;
                $http.post('http://localhost:9090/api/logout', {});

                $location.path("/login");
            }

        }
    }
});

myApp.factory('TokenInterceptor', function($q, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers['X-Access-Token'] = $window.sessionStorage.token;
                config.headers['X-Key'] = $window.sessionStorage.user;
                config.headers['Content-Type'] = "application/json";
            }
            return config || $q.when(config);
        },

        response: function(response) {
            return response || $q.when(response);
        }
    };
});