'use strict';

angular.module('weatherApp', []);

/**
 * This service stores the data relating to the weather, so it can be shared between googlePlacesController and searchForm
 */
angular.module('weatherApp').factory('weather', ['$http',
    function ($http) {
        var weather = '';
        var place = {};

        return {
            weather: weather,
            place: place
        };
    }
]);

angular.module('weatherApp').controller('searchForm', ['$http', 'weather',
    function ($http, weather) {
        var self = this;

        self.place = weather.place;
        self.weather = weather.weather;
        self.coordinates = '';
        self.locName = weather.place.formatted_address;

        self.doSearch = function () {
            if (!self.place) {
                alert('Not found...');
            } else {
                var url = "https://api.forecast.io/forecast/7ce90a9cbabf8e10728551e92b826887/" + self.place.geometry.location.k + "," + self.place.geometry.location.D + "?callback=JSON_CALLBACK";

                $http.jsonp(url).success(function (data) {
                    console.log('Got some data!');
                    console.log(data);
                    self.title = "Weather for " + self.place.formatted_address + "...";
                    self.weather = "Temperature is: " + data.currently.temperature + " degrees Fahrenheit.";
                });

                self.coordinates = "Weather for: " + self.location;
            }
        };
    }
]);

angular.module('weatherApp').directive('googlePlaces', function () {
    return {
        restrict: 'E',
        replace: true,
        controller: 'googlePlacesController', // no need for 'controller as' syntax here, as we access it from ctrl argument
        template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
        link: function ($scope, elm, attrs, ctrl) {
            var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                ctrl.setPlace(place);
            });
        }
    }
}).controller('googlePlacesController', ['weather',
    function (weather) {
        this.setPlace = function (place) {
            angular.extend(weather.place, place);
        };
    }
]);
