angular.module('controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, uiGmapGoogleMapApi) {
    $scope.search = null;
    $scope.mapReady = false;
    $scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 6 };

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
                coords: {
                    latitude: $scope.map.center.latitude,
                    longitude: $scope.map.center.longitude
                }
            };
            $scope.map.zoom = 15;
            $ionicLoading.hide();
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.$on('g-places-autocomplete:select', function (event, place) {
        $scope.place = place;
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        var lat = place.geometry.location.lat();
        var lon = place.geometry.location.lng();
        var placeLatLon = new google.maps.LatLng(lat, lon);
        $scope.map.setCenter(placeLatLon);
        if (undefined !== $scope.placeLatLon) {
            $scope.placeMarker.setMap(null);
        }
        $scope.placeMarker = new google.maps.Marker({
            map: $scope.map,
            position: placeLatLon
        });
        $ionicLoading.hide();
    });
});
