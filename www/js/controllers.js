angular.module('controllers', [])

.controller('MapCtrl', function($scope, $rootScope, $ionicLoading, uiGmapGoogleMapApi) {
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
        $scope.centerMap();
    });

    $scope.$on('$stateChangeSuccess', function(event,toState,toParams,fromState) {
        // "" for name indicates that it's the initial transition.
        // Not ideal, but that's how Angular works atm :/
        // https://github.com/angular-ui/ui-router/issues/1307#issuecomment-59570535
        if ("" !== fromState.name && "map" === toState.name) {
            if ($scope.mapReady) {
                $scope.centerMap();
            }
        }
    })

    $scope.centerOnMe = function() {
        console.log('Getting current location');
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log('Got pos', pos);
            $scope.search.place = "My location";
            $scope.search.lat = pos.coords.latitude;
            $scope.search.lng = pos.coords.longitude;
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
                    latitude: $scope.search.lat,
                    longitude: $scope.search.lng
                }
            };
            $scope.centerMap();
            $ionicLoading.hide();
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.centerMap = function() {
        console.log("Centering");
        if (Object.keys($scope.search).length === 0) {
            $scope.centerOnMe();
        } else {
            $scope.map.center.latitude = $scope.search.lat;
            $scope.map.center.longitude = $scope.search.lng;
            $scope.map.zoom = 15;
        }
    };

    $scope.$on('g-places-autocomplete:select', function(event, place) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        $scope.search.place = place;
        $scope.search.lat = place.geometry.location.lat();
        $scope.search.lng = place.geometry.location.lng();
        $scope.map.search = {
            id: 'search',
            coords: {
                latitude: $scope.search.lat,
                longitude: $scope.search.lng
            }
        };
        $scope.centerMap();
        $ionicLoading.hide();
    });
})

.controller('ListCtrl', function($scope, $rootScope, $ionicLoading) {
    console.log('ready');

    $scope.$on('g-places-autocomplete:select', function(event, place) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        $scope.search.place = place;
        $scope.search.lat = place.geometry.location.lat();
        $scope.search.lng = place.geometry.location.lng();
        $ionicLoading.hide();
    });
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
        suppressInfoWindows();

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

    // Suppress info windows
    // Source: http://stackoverflow.com/a/19710396
    function suppressInfoWindows() {
        //Here we redefine set() method.
        //If it is called for map option, we hide InfoWindow, if "noSupress" option isnt true.
        //As Google doesn't know about this option, its InfoWindows will not be opened.
        var set = google.maps.InfoWindow.prototype.set;
        google.maps.InfoWindow.prototype.set = function (key, val) {
            if (key === 'map') {
                if (!this.get('noSupress')) {
                    console.log('This InfoWindow is supressed. To enable it, set "noSupress" option to true');
                    return;
                }
            }
            set.apply(this, arguments);
        }
    }

})

.controller('ReportCtrl', function($scope) {
    console.log('ready');
});
