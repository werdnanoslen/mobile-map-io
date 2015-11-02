angular.module('controllers', [])

.controller('MapCtrl', function($scope, $rootScope, $ionicLoading, uiGmapGoogleMapApi) {
    $scope.mapReady = false;
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        options: {
            disableDefaultUI: true
        },
        zoom: 15
    };

    uiGmapGoogleMapApi.then(function(uiMap) {
        $scope.mapReady = true;
        $scope.centerMap();
        $scope.overrideInfoWindowClick();
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
        }
    };

    $scope.$on('g-places-autocomplete:select', function(event, place) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        $scope.search.place = place.name + ", " + place.formatted_address;
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

    $scope.overrideInfoWindowClick = function() {
        var set = google.maps.InfoWindow.prototype.set;
        google.maps.InfoWindow.prototype.set = function (key, val) {
            if (key === 'map') {
                if (!this.get('noSupress')) {
                    var nodes = this.content.childNodes;
                    var name = nodes[0].innerHTML;
                    var address = nodes[1].childNodes[0].innerHTML;
                    $scope.search.place = name + ", " + address;
                    $scope.search.lat = this.position.lat();
                    $scope.search.lng = this.position.lng();
                    $scope.centerMap();
                    $scope.$apply();
                    return;
                }
            }
            set.apply(this, arguments);
        }
    };
})

.controller('ListCtrl', function($scope, $rootScope, $ionicLoading) {
    console.log('ready');

    $scope.$on('g-places-autocomplete:select', function(event, place) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        $scope.search.place = place.name + ", " + place.formatted_address;
        $scope.search.lat = place.geometry.location.lat();
        $scope.search.lng = place.geometry.location.lng();
        $ionicLoading.hide();
    });
})

.controller('AddCtrl', function($scope, $rootScope, $ionicLoading, uiGmapGoogleMapApi) {
    var geocoder = new google.maps.Geocoder();
    // hacked because gmap's events don't include infowindow clicks
    $scope.centerSetByPlaceClick = false;

    $scope.mapReady = false;
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        events: {
            idle: function(map) {
                if ($scope.centerSetByPlaceClick) {
                    $scope.centerSetByPlaceClick = false;
                } else {
                    var latlng = map.getCenter();
                    geocoder.geocode({'location': latlng}, function(results, status) {
                        var topResult = results[0];
                        if (google.maps.GeocoderStatus.OK === status) {
                            if ("ROOFTOP" === topResult.geometry.location_type) {
                                $scope.search.place = topResult.formatted_address;
                            } else {
                                console.log('No exact address for this location: ', latlng);
                                $scope.search.place = latlng.toUrlValue();
                            }
                        } else {
                            console.error('geocode error: ', status);
                            $scope.search.place = latlng.toUrlValue();
                        }
                        $scope.search.lat = latlng.lat;
                        $scope.search.lng = latlng.lng;
                        //TODO: handle scope updates to async model better than this
                        $scope.$apply();
                    });
                }
            }
        },
        options: {
            disableDefaultUI: true
        },
        zoom: 15
    };

    uiGmapGoogleMapApi.then(function(uiMap) {
        $scope.mapReady = true;
        $scope.centerMap();
        $scope.overrideInfoWindowClick();
    });

    $scope.centerMap = function() {
        console.log("Centering");
        if (Object.keys($scope.search).length === 0) {
            $scope.centerOnMe();
        } else {
            $scope.map.center.latitude = $scope.search.lat;
            $scope.map.center.longitude = $scope.search.lng;
        }
    };

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

    $scope.$on('g-places-autocomplete:select', function(event, place) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        $scope.search.place = place;
        $scope.search.lat = place.geometry.location.lat();
        $scope.search.lng = place.geometry.location.lng();
        $scope.centerMap();
        $ionicLoading.hide();
    });

    $scope.overrideInfoWindowClick = function() {
        var set = google.maps.InfoWindow.prototype.set;
        google.maps.InfoWindow.prototype.set = function (key, val) {
            if (key === 'map') {
                if (!this.get('noSupress')) {
                    var nodes = this.content.childNodes;
                    var name = nodes[0].innerHTML;
                    var address = nodes[1].childNodes[0].innerHTML;
                    $scope.search.place = name + ", " + address;
                    $scope.search.lat = this.position.lat();
                    $scope.search.lng = this.position.lng();
                    $scope.centerSetByPlaceClick = true;
                    $scope.centerMap();
                    $scope.$apply();
                    return;
                }
            }
            set.apply(this, arguments);
        }
    };
})

.controller('ReportCtrl', function($rootScope, $scope, uiGmapGoogleMapApi) {
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        options: {
            disableDefaultUI: true
        },
        zoom: 15
    };
    $scope.date = "2015/01/01";
    $scope.time = "00:00"
    $scope.number = "100"
    $scope.sometext = "asdouiahspuhwrgp9uhwr098hw08h8haps978aysd90g87asgp9uahwre9h";
    $scope.place = "M Street, 950 Marietta St, Atlanta, GA 30318";
});
