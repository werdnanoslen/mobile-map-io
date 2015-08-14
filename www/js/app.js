'use strict';

angular.module('mobile-map-io', [
    'ionic',
    'uiGmapgoogle-maps',
    'google.places',
    'controllers',
    'directives'
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
    }).state('add', {
        url: '/add',
        templateUrl: 'templates/add.html',
        controller: 'AddCtrl'
    });

    $urlRouterProvider.otherwise('/map');
});
