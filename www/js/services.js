angular.module('services', [])

.factory('API', function ($q) {
    var deferred = $q.defer();

    return {
        geocodeLatLng: function(latlng, callback) {
            console.log('Getting location');
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'location': latlng}, function(results, status) {
                var topResult = results[0];
                var place;
                if (google.maps.GeocoderStatus.OK === status) {
                    if ('ROOFTOP' === topResult.geometry.location_type) {
                        place = topResult.formatted_address;
                    } else {
                        place = latlng.toUrlValue();
                        console.log('No exact address for this location: ', place);
                    }
                } else {
                    console.error('geocode error: ', status);
                    place = latlng.toUrlValue();
                }
                callback(place);
            });
        },
        getReportsInBounds: function (bounds) {
            if (undefined === bounds) {
                var neLat = 0;
                var neLng = 0;
                var swLat = 0;
                var swLng = 0;
            } else {
                var neLat = bounds.getNorthEast().lat();
                var neLng = bounds.getNorthEast().lng();
                var swLat = bounds.getSouthWest().lat();
                var swLng = bounds.getSouthWest().lng();
            }
            var lat = (neLat + swLat) / 2;
            var lng = (neLng + swLng) / 2;
            var rand = Math.random()/100;
            var report = {
                latitude: lat + rand,
                longitude: lng + rand,
                title: rand.toString(),
                id: Math.floor(rand*10000)
            };
            deferred.resolve(report);
            return deferred.promise;
        }
    };
});
