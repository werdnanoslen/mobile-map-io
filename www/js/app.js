angular.module('mobile-map-io', [
    'ionic',
    'ionic-material',
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
    });

    $urlRouterProvider.otherwise('/map');
});
