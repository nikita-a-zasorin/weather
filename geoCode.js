'use strict';

angular.module('weatherApp', ['ui.router']);

angular.module('weatherApp')
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'home.html',
                    controller: 'searchForm as main'
                })
                .state('location', {
                    url: '/location/:coords',
                    templateUrl: 'location.html',
                    controller: 'locationPageController as loc'
                });
        }
    ]);

/**
 * This service stores the data relating to the weather, so it can be shared between googlePlacesController and searchForm
 */
angular.module('weatherApp').factory('weather', ['$http',
    function ($http) {

        var weather = {};
        var location = {
            coords: '',
            name: ''
        };

        return {
            weather: weather,
            location: location,
            doSearch: function () {
                if (!location.coords) {
                    alert('Not found...');
                } else {
                    var url = "https://api.forecast.io/forecast/7ce90a9cbabf8e10728551e92b826887/" + location.coords + "?callback=JSON_CALLBACK";
                    $http.jsonp(url).success(function (data) {
                        console.log(data);
                        angular.extend(weather, data.currently);
                    });
                }
            },
            setPlace: function (newPlace) {
                console.log(newPlace);
                location.coords = newPlace.geometry.location.lat() + ',' + newPlace.geometry.location.lng();
                location.name = newPlace.formatted_address;
            }
        };
    }
]);

angular.module('weatherApp').controller('searchForm', ['$http', 'weather',
    function ($http, weather) {
        var self = this;

        self.weather = weather.weather;
        self.location = weather.location;

        self.doSearch = function () {
            weather.doSearch();
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
            console.log(place.geometry.location.lat());
            weather.setPlace(place);
            /**
            weather.setLocation(place.formatted_address);
            weather.setCoords(place.geometry.location.D, place.geometry.location.k);
             */
        };
    }
]);

angular.module('weatherApp').controller('locationPageController', ['$stateParams', 'weather',
    function ($stateParams, weather) {
       var self = this;

        self.coords = $stateParams.coords;
        weather.location.coords = $stateParams.coords;

        self.doSearch = function () {
            weather.doSearch();
        };
    }
]);
