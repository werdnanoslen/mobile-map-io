angular.module('controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, uiGmapGoogleMapApi) {
    $scope.mapReady = false;
    $scope.searchBarVisible = false;
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        events: {
            dragstart: function(map) {
                $scope.searchBarVisible = false;
            }
        },
        options: {
            disableDefaultUI: true
        },
        zoom: 6
    };

    uiGmapGoogleMapApi.then(function(uiMap) {
        $scope.mapReady = true;
        $scope.centerOnMe();
    });

    $scope.centerOnMe = function() {
        console.log("Centering");
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log('Got pos', pos);
            $scope.map.center.latitude = pos.coords.latitude;
            $scope.map.center.longitude = pos.coords.longitude;
            $scope.map.position = {
                id: 'position',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillOpacity: 1.0,
                    fillColor: '#4D90FE',
                    strokeColor: '#ffffff',
                    strokeWeight: 2.0,
                    scale: 7
                },
                coords: {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }
            };
            $scope.map.zoom = 15;
            $ionicLoading.hide();
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.$on('g-places-autocomplete:select', function(event, place) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        var lat = place.geometry.location.lat();
        var lon = place.geometry.location.lng();
        $scope.map.center.latitude = lat;
        $scope.map.center.longitude = lon;
        $scope.map.search = {
            id: 'search',
            coords: {
                latitude: lat,
                longitude: lon
            }
        };
        $scope.map.zoom = 15;
        $ionicLoading.hide();
    });
})

.controller('ListCtrl', function($scope) {
    console.log('ready');
})

.controller('AddCtrl', function($scope, $ionicHistory, $ionicLoading, uiGmapGoogleMapApi) {
    var geocoder = new google.maps.Geocoder();

    $scope.mapReady = false;
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        events: {
            idle: function(map) {
                // after pan/zoom: update search bar to reflect new location
                var latlng = map.getCenter();
                geocoder.geocode({'location': latlng}, function(results, status) {
                    var topResult = results[0];
                    if (google.maps.GeocoderStatus.OK === status) {
                        if ("ROOFTOP" === topResult.geometry.location_type) {
                            $scope.search = topResult.formatted_address;
                        } else {
                            console.log('No exact address for this location: ', latlng);
                            $scope.search = latlng.toUrlValue();
                        }
                    } else {
                        console.error('geocode error: ', status);
                        $scope.search = latlng.toUrlValue();
                    }
                    //TODO: handle scope updates to async model better than this
                    $scope.$apply();
                });
            }
        },
        options: {
            disableDefaultUI: true
        },
        zoom: 6
    };

    uiGmapGoogleMapApi.then(function(uiMap) {
        $scope.mapReady = true;
        $scope.centerOnMe();
        var gmap = document.getElementsByClassName('angular-google-map-container')[0];

        // inject a marker, fixed to the center of the map
        var div = document.getElementById('mapContainer');
        var node = document.createElement('div');
        node.id = 'centerMarker';
        div.appendChild(node);
    });

    $scope.centerOnMe = function() {
        console.log("Centering");
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log('Got pos', pos);
            $scope.map.center.latitude = pos.coords.latitude;
            $scope.map.center.longitude = pos.coords.longitude;
            // $scope.map.reportMarker = {
            //     id: 'report',
            //     coords: {
            //         latitude: pos.coords.latitude,
            //         longitude: pos.coords.longitude
            //     }
            // };
            $scope.map.position = {
                id: 'position',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillOpacity: 1.0,
                    fillColor: '#4D90FE',
                    strokeColor: '#ffffff',
                    strokeWeight: 2.0,
                    scale: 7
                },
                coords: {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }
            };
            $scope.map.zoom = 17;
            $ionicLoading.hide();
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.$on('g-places-autocomplete:select', function(event, place) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        var lat = place.geometry.location.lat();
        var lon = place.geometry.location.lng();
        $scope.map.center.latitude = lat;
        $scope.map.center.longitude = lon;
        $scope.map.search = {
            id: 'search',
            coords: {
                latitude: lat,
                longitude: lon
            }
        };
        $scope.map.zoom = 17;
        $ionicLoading.hide();
    });
})

.controller('ReportCtrl', function($scope) {
    console.log('ready');
});
