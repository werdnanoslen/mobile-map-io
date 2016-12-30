angular.module('controllers')

.controller('ReportCtrl', function($rootScope, $scope, $ionicLoading, $log,
            $state, $ionicHistory, $location, $ionicPopup, uiGmapGoogleMapApi, API) {
    $scope.noGoingBack = true;
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        markers: {
            options: {
                icon: {
                    url: 'img/location.png',
                    scaledSize: new google.maps.Size(50, 50), // scaled size
                }
            }
        },
        options: {
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            draggable: false,
            scrollwheel: false
        },
        zoom: 15
    };
    $scope.location = encodeURIComponent($location.absUrl());

    var promise = API.getReport($state.params.reportId);
    promise.then(
        function (payload) {
            var report = payload.data.report[0];
            $scope.form = report;
            $scope.map.center.latitude = report.lat;
            $scope.map.center.longitude = report.lng;
            $scope.map.search = {
                id: 'search',
                coords: {
                    latitude: report.lat,
                    longitude: report.lng
                }
            };
            if ($scope.form.place === null) {
                $scope.form.place = $scope.form.lat + ", " + $scope.form.lng;
            }
            $rootScope.search.lat = report.lat;
            $rootScope.search.lng = report.lng;
            $rootScope.search.place = $scope.form.place;

            var then = new Date(report.datetime_reported);
            var now = new Date();
            var daysAgo = Math.round((now-then)/(1000*60*60*24));
            var datetimeString = "at an unknown time";
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (daysAgo == 0) {
                datetimeString = "today";
            } else if (daysAgo == 1) {
                datetimeString = "yesterday";
            } else if (daysAgo <= 7) {
                datetimeString = daysAgo + " days ago";
            } else if (then.getYear() === now.getYear()) {
                datetimeString = monthNames[then.getMonth()] + " " + then.getDate();
            } else {
                datetimeString = monthNames[then.getMonth()] + " " + then.getDate() + ", " + then.getFullYear();
            }
            console.log(then);
            $scope.whenReported = "Posted " + datetimeString;
        },
        function (errorPayload) {
            $log.error('failure fetching report', errorPayload);
        }
    );

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if (null === $ionicHistory.backView()) {
            $scope.noGoingBack = true;
        } else if ("add" === $ionicHistory.backView().stateId) {
            $scope.noGoingBack = true;
        } else {
            $scope.noGoingBack = false;
        }
    });

    $scope.showActiveQuestion = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove this report',
            buttons: [
                {
                    text: 'Cancel',
                    type: 'button-light'
                },
                {
                    text: 'Yes',
                    type: 'button-positive',
                    onTap: function(e) {
                        var id = $state.params.reportId
                        var update = {
                            active: 0
                        }
                        var promise = API.updateReport(id, update);
                        promise.then(
                            function (payload) {
                                $log.log('op is over');
                                $ionicLoading.show({
                                    template: 'Thanks, this report won\'t show up anymore',
                                    duration: 2000
                                });
                            },
                            function (errorPayload) {
                                $log.error('failure updating report', errorPayload);
                                $ionicLoading.show({
                                    template: 'Sorry, there was an error',
                                    duration: 2000
                                });
                            }
                        );
                    }
                }
            ]
        });
    };
});
