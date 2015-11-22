angular.module('directives', [])

.directive('searchField', function() {
    var TEMPLATE = [
        '<input type="search" ',
            'g-places-autocomplete ',
            'ng-model="search.place "',
            'class="flex-item" ',
        '/>',
        '<button ng-click="centerOnMe()" ',
            'class="button button-small button-icon icon ion-pinpoint"',
        '</button>'
    ];
    return {
        restrict: 'E',
        controller: function($scope, $element) {
            $element.addClass('flex');
            $scope.centerOnMe = function() {
                console.log('Getting current location');
                $scope.loading = $ionicLoading.show({
                    content: 'Getting current location...',
                    showBackdrop: false
                });
                navigator.geolocation.getCurrentPosition(function(pos) {
                    console.log('Got pos', pos);
                    $scope.search.place = 'My location';
                    $scope.search.lat = pos.coords.latitude;
                    $scope.search.lng = pos.coords.longitude;
                    $ionicLoading.hide();
                }, function(error) {
                    alert('Unable to get location: ' + error.message);
                });
            };
        },
        scope: {
            gPlacesAutocomplete: '='
        },
        template: TEMPLATE.join('')
    }
});
