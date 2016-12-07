angular.module('controllers')

.controller('MapCtrl', function($scope, $rootScope, $ionicLoading, $state, $log,
        uiGmapGoogleMapApi, uiGmapIsReady, API) {
    var geocoder = new google.maps.Geocoder();
    var filterCriteria;
    $scope.Gmap;
    $scope.search = {};
    $scope.explicitSearch = false;
    $scope.reports = {
        'events': {
            click: function(gMarker, eventName, model) {
                $state.go('report', {reportId: model.id});
            }
        },
        'markers': [],
        'options': {
            'icon': {
                url: 'img/location.png',
                scaledSize: new google.maps.Size(50, 50) // scaled size
            }
        }
    };
    $scope.suggestions = {
        'events': {
            click: function(gMarker, eventName, model) {
                // When centered on suggestion, clicking again acts as add button
                if (model.title === $rootScope.search.place) {
                    $state.go('add');
                }
                $rootScope.search.lat = model.latitude;
                $rootScope.search.lng = model.longitude;
                $rootScope.search.place = model.title;
                var bounds = new google.maps.LatLngBounds();
                var latlng = new google.maps.LatLng(model.latitude, model.longitude);
                bounds.extend(latlng);
                $scope.Gmap.fitBounds(bounds);
            }
        },
        'markers': [],
        'options': {
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillOpacity: 1.0,
                fillColor: '#387ef5',
                strokeColor: '#111111',
                strokeWeight: 2.0,
                scale: 7
            },
        }
    };
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        control: {},
        events: {
            idle: function(map) {
                var bounds = map.getBounds();
                $scope.map.searchbox.options.bounds = bounds;
                $scope.updateBounds(map);
            },
            zoom_changed: function(map) {
                var bounds = map.getBounds();
                $scope.map.searchbox.options.bounds = bounds;
                $scope.updateBounds(map);
            }
        },
        options: {
            disableDefaultUI: true,
            clickableIcons: false,
            cluster: {
                styles: [{
                    url: "img/m2.png",
                    width: 53,
                    height: 50,
                    textColor: 'white',
                    textSize: 14
                }]
            }
        },
        searchbox: {
            events: {
                places_changed: function (searchBox) {
                    filterCriteria = undefined;
                    $scope.explicitSearch = true;
                    var places = searchBox.getPlaces();
                    var bounds = new google.maps.LatLngBounds();
                    $scope.suggestions.markers = [];
                    for (var i=0; i<places.length; ++i){
                        var place = places[i];
                        var marker = {
                            id: place.id,
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng(),
                            title: place.name
                        };
                        var latlng = new google.maps.LatLng(marker.latitude, marker.longitude);
                        bounds.extend(latlng);
                        $scope.suggestions.markers.push(marker);
                    }
                    $rootScope.search.lat = places[0].geometry.location.lat();
                    $rootScope.search.lng = places[0].geometry.location.lng();
                    $rootScope.search.place = places[0].name + ', ' + places[0].formatted_address;
                    $scope.Gmap.fitBounds(bounds);
                    if (places.length < 2) {
                        $scope.Gmap.fitBounds(places[0].geometry.viewport);
                    }
                }
            },
            options: {
                bounds: {}
            },
            parentdiv: "searchBarBox",
            template:'templates/searchbox.html'
        },
        zoom: 15
    };

    uiGmapGoogleMapApi.then(function(uiMap) {
        $scope.centerMap();
    });

    $scope.centerOnMe = function() {
        console.log('Getting current location');
        $ionicLoading.show({
            template: 'Getting current location',
            duration: 10000
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

    $scope.setCenter = function(lat, lng) {
        console.log('got location', {lat, lng});
        $scope.search.lat = lat;
        $scope.search.lng = lng;
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
    };

    $scope.centerMap = function() {
        console.log('Centering');
        if (Object.keys($scope.search).length === 0) {
            $scope.centerOnMe();
        } else {
            $scope.map.center.latitude = $scope.search.lat;
            $scope.map.center.longitude = $scope.search.lng;
            if (undefined !== $scope.Gmap) {
                var latlng = new google.maps.LatLng($scope.search.lat, $scope.search.lng);
                $scope.Gmap.setCenter(latlng);
            }
        }
    };

    $scope.filterReports = function() {
        if (undefined !== filterCriteria) {
            console.log('filtering by \'' + filterCriteria + '\'');
            $ionicLoading.show({
                template: 'Searching',
                duration: 10000
            });
            var promise = API.getReports({"*": filterCriteria});
            promise.then(
                function (payload) {
                    if (204 === payload.status) {
                        console.log("no reports with that criteria");
                    } else {
                        var reports = payload.data.reports;
                        var markers = $scope.reports.markers;
                        $scope.reports.markers = [];
                        for (var i=0; i<markers.length; ++i) {
                            for (var j=0; j<reports.length; ++j) {
                                if (markers[i].id === reports[j].id) {
                                    $scope.reports.markers.push(reports[j]);
                                }
                            }
                        }
                    }
                    $ionicLoading.hide();
                },
                function (errorPayload) {
                    $log.error('failure filtering reports', errorPayload);
                    $scope.reports.markers = [];
                    $ionicLoading.hide();
                }
            );
        }
    }

    $scope.clearSearch = function() {
        $scope.explicitSearch = false;
        $scope.search.place = "";
        document.getElementById('pac-input').value = "";
        $scope.suggestions.markers = [];
    }

    $scope.submitSearch = function(keyEvent) {
        if (undefined === keyEvent) {
            $scope.search.place = filterCriteria;
        } else if (13 === keyEvent.which) {
            filterCriteria = $scope.search.place;
        }
    }

    $scope.updateBounds = function(map) {
        $scope.Gmap = map;
        $scope.search.lat = map.center.lat();
        $scope.search.lng = map.center.lng();
        var latlng = new google.maps.LatLng($scope.search.lat, $scope.search.lng);
        var bounds = $scope.Gmap.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        $scope.map.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);

        var distance = Math.sqrt(Math.pow(((69.1/1.61) * (ne.lat() - sw.lat())), 2) + Math.pow(((53/1.61) * (ne.lng() - sw.lng())), 2))/2;
        var promise = API.getReportsNearby(latlng.lat(), latlng.lng(), distance);
        promise.then(
            function (payload) {
                if (204 === payload.status) {
                    console.log("no reports in bounds");
                } else {
                    var reports = payload.data.reports;
                    console.log('fetched reports', payload);
                    for (var i=0; i<reports.length; ++i) {
                        var report = reports[i];
                        var distance = (0 == report.distance) ? '<0.1' : report.distance;
                        var marker = {
                            latitude: report.lat,
                            longitude: report.lng,
                            title: report.place,
                            id: report.id,
                            distance: distance
                        };
                        $scope.reports.markers.push(marker);
                    }
                    $scope.filterReports();
                }
            },
            function (errorPayload) {
                $log.error('failure getting reports', errorPayload);
            }
        );
    };
})
