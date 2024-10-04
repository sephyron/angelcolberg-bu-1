/**
 *
 * @description           Portfolio for Angel Colberg
 * @author                Angel Colberg // www.angelcolberg.com
 * @url                   www.angelcolberg.com
 * @version               1.1.1
 * @date                  March 2017
 * @license               MIT
 *
 */
;
(function() {


    /**
     * Definition of the main app module and its dependencies
     */
    angular
        .module('portfolio-app', [
            'ngRoute',
            'ngAnimate'
        ])
        .config(config);

    // safe dependency injection
    // this prevents minification issues
    config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider'];

    /**
     * App routing
     *
     * You can leave it here in the config section or take it out
     * into separate file
     *
     */
    function config($routeProvider, $locationProvider, $httpProvider, $compileProvider) {

        $locationProvider.html5Mode(true).hashPrefix('!');

        // routes
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .when('/work', {
                templateUrl: 'views/work.html',
                controller: 'WorkController',
                controllerAs: 'work'
            })
            .when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'ContactController',
                controllerAs: 'contact'
            })
            .otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push('authInterceptor');

    }


    /**
     * You can intercept any request or response inside authInterceptor
     * or handle what should happend on 40x, 50x errors
     *
     */
    angular
        .module('portfolio-app')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$rootScope', '$q', 'LocalStorage', '$location'];

    function authInterceptor($rootScope, $q, LocalStorage, $location) {

        return {

            // intercept every request
            request: function(config) {
                config.headers = config.headers || {};
                return config;
            },

            // Catch 404 errors
            responseError: function(response) {
                if (response.status === 404) {
                    $location.path('/');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    }


    /**
     * Run block
     */
    angular
        .module('portfolio-app')
        .run(run);

    run.$inject = ['$rootScope', '$location', '$routeParams'];

    function run($rootScope, $location, $routeParams) {
        $rootScope.path = '/' + $routeParams.dir;
        // put here everything that you need to run on page load
        var $ = jQuery.noConflict();



        // DOM Ready
        $(function() {




        });


    }


})();