angular.module('services', [])

.factory('API', function ($q, $http) {
    var deferred = $q.defer();
    var api = 'localhost:8080/api/';

    return {
        ipGeolocate: function() {
            return $http.get('http://ipinfo.io');
        },
        getReports: function () {
            return $http.get(api + 'reports');
        },
        getReport: function (id) {
            return $http.get(api + 'reports/' + id);
        },
        getReports: function(filters) {
            return $http({
                url: api + 'reports/filter',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: filters
            });
        },
        getReportsNearby: function(myLat, myLng, kmAway) {
            return $http({
                url: api + 'reports/nearby',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: {'myLat': myLat, 'myLng': myLng, 'kmAway': kmAway}
            });
        },
        addReport: function (reportJson) {
            return $http({
                url: api + 'reports',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: {'reportJson': reportJson}
            });
        },
        updateReport: function (id, reportJson) {
            return $http({
                url: api + 'reports/' + id,
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                data: {'reportJson': reportJson}
            });
        },
        deleteReport: function (id) {
            return $http({
                url: api + 'reports/' + id,
                method: 'DELETE'
            });
        }
    };
});
