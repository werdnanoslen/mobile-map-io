angular.module('services', [])
    .factory('API', function ($q) {
        var deferred = $q.defer();

        return {
            getReportsInBounds: function (bounds) {
                var neLat = bounds.getNorthEast().lat();
                var neLng = bounds.getNorthEast().lng();
                var swLat = bounds.getSouthWest().lat();
                var swLng = bounds.getSouthWest().lng();
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
