'use strict';

var geoHashingApp = angular.module('GeoHashingApp', ['ngRoute', 'yaMap', 'textAngular', 'ui.router']);

geoHashingApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('main_state', {
            url: "/",
            templateUrl: 'views/main.html',
            controller: 'MarkersListCtrl',
            data:{
                needAuth:  false
            }
        })
        .state('edit_marker', {
            url: '/edit/marker/:id',
            templateUrl: 'views/edit_marker.html',
            controller: 'EditMarkerCtrl',
            data:{
                needAuth:  true
            }
        })
        .state('add_marker', {
            url: '/add/marker',
            templateUrl: 'views/edit_marker.html',
            controller: 'EditMarkerCtrl',
            data:{
                needAuth:  true
            }
        })
        .state('show_marker',{
            url: '/show/:id',
            templateUrl: 'views/single_marker_view.html',
            controller: 'SingleMarkerViewCtrl',
            data:{
                needAuth:  false
            }
        });
});

geoHashingApp.run(function($rootScope, $location, AuthenticationService) {

    // enumerate routes that don't need authentication
    var routesThatDontRequireAuth = ['/login'];

    // check if current location matches route
    var routeClean = function (route) {
        return _.find(routesThatDontRequireAuth,
            function (noAuthRoute) {
                return _.str.startsWith(route, noAuthRoute);
            });
    };

    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
        // if route requires auth and user is not logged in
        if (!routeClean($location.url()) && !AuthenticationService.isLoggedIn()) {
            // redirect back to login
            $location.path('/login');
        }
    });
});