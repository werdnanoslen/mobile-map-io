angular.module('controllers')

.controller('ListCtrl', function($scope, $rootScope, $ionicLoading, $log, API) {
    console.log('ready');
    $scope.explicitSearch = true;
    $scope.reports = {
        'markers': []
    };

    var autocomplete = new google.maps.places.Autocomplete(document.querySelector('#search'));
    autocomplete.addListener('place_changed', function() {
        $scope.explicitSearch = true;
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        var place = autocomplete.getPlace();
        $scope.search.place = place.name + ", " + place.formatted_address;
        $scope.search.lat = place.geometry.location.lat();
        $scope.search.lng = place.geometry.location.lng();
        $scope.updateReportsInBounds();
        $ionicLoading.hide();
    });

    $scope.centerOnMe = function() {
        console.log('Getting current location');
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.setCenter(pos.coords.latitude, pos.coords.longitude);
            $ionicLoading.hide();
        }, function(error) {
            var promise = API.ipGeolocate();
            promise.then(
                function (payload) {
                    var latlng = payload.data.loc.split(',');
                    $scope.setCenter(latlng[0], latlng[1]);
                    $ionicLoading.hide();
                },
                function (errorPayload) {
                    $log.error('Unable to get location', errorPayload);
                    $ionicLoading.hide();
                }
            );
            $log.error('Unable to get location', error.message);
        });
    };

    $scope.clearSearch = function() {
        $scope.explicitSearch = false;
        $scope.search.place = "";
    }

    $scope.setCenter = function(lat, lng) {
        console.log('got location', {lat, lng});
        $scope.search.place = 'My location';
        $scope.search.lat = lat;
        $scope.search.lng = lng;
        $scope.updateReportsInBounds();
    };

    $scope.updateReportsInBounds = function(kmAway=5) {
        var lat = $scope.search.lat;
        var lng = $scope.search.lng;
        if (undefined === lat | undefined === lng) {
            return;
        }
        $scope.reports.markers = [];
        var promise = API.getReportsNearby($scope.search.lat, $scope.search.lng, kmAway);
        promise.then(
            function (payload) {
                if (204 === payload.status) {
                    console.log("no reports in bounds");
                    if (kmAway <= 50000) {//based on earth circumference
                        $scope.updateReportsInBounds(kmAway*10);
                    } else {
                        console.log("there don't seem to be any reports at all");
                    }
                } else {
                    var reports = payload.data.reports;
                    for (var i=0; i<reports.length; ++i) {
                        var report = reports[i];
                        var distance = (0 == report.distance) ? '<0.1' : report.distance;
                        var marker = {
                            latitude: report.lat,
                            longitude: report.lng,
                            place: report.place,
                            notes: report.notes,
                            id: report.id,
                            distance: distance
                        };
                        $scope.reports.markers.push(marker);
                    }
                }
            },
            function (errorPayload) {
                $log.error('failure getting reports', errorPayload);
            }
        );
    };

    console.log('Centering');
    if (Object.keys($scope.search).length === 0) {
        $scope.centerOnMe();
    } else {
        $scope.updateReportsInBounds();
    }
})
