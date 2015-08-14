angular.module('controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, uiGmapGoogleMapApi) {
    $scope.mapReady = false;
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
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
});
