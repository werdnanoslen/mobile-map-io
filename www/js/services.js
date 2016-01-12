angular.module('services', [])

.factory('API', function ($q, $http) {
    var deferred = $q.defer();
    var api = 'http://andyhub.com/demos/mobile-map-io/api/';

    return {
        getReports: function () {
            return $http.get(api + 'reports');
        },
        getReport: function (id) {
            return $http.get(api + 'reports/' + id);
        },
        addReport: function (reportJson) {
            return $http({
                url: api + 'reports',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: {"reportJson": reportJson}
            });
        },
        getReportsInBounds: function (bounds) {
            var neLat;
            var neLng;
            var swLat;
            var swLng;

            if (undefined === bounds) {
                neLat = 0;
                neLng = 0;
                swLat = 0;
                swLng = 0;
            } else {
                neLat = bounds.getNorthEast().lat();
                neLng = bounds.getNorthEast().lng();
                swLat = bounds.getSouthWest().lat();
                swLng = bounds.getSouthWest().lng();
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
