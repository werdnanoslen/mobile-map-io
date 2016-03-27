angular.module('services', [])

.factory('API', function ($q, $http) {
    var deferred = $q.defer();
    var api = '//45.55.80.26:8080/demos/mobile-map-io/api/';

    return {
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
                data: {filters}
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
                method: 'POST',
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
