'use strict';

angular.module('mobile-map-io', [
    'ionic',
    'uiGmapgoogle-maps',
    'google.places',
    'controllers',
    'directives'
])

.run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
        $rootScope.search = {};
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
    }).state('list', {
        url: '/list',
        templateUrl: 'templates/list.html',
        controller: 'ListCtrl'
    }).state('add', {
        url: '/add',
        templateUrl: 'templates/add.html',
        controller: 'AddCtrl'
    }).state('report', {
        url: '/report/:reportId',
        templateUrl: 'templates/report.html',
        controller: 'ReportCtrl',
        resolve: {
            reportId: ['$stateParams', function ($stateParams) {
                return $stateParams.reportId;
            }]
        }
    });

    $urlRouterProvider.otherwise('/map');
});
