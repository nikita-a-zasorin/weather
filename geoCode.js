            'use strict';

            angular.module('weatherApp', ['weatherDirectives']);


            function searchForm($scope, $http){
                $scope.location = '';

                $scope.doSearch = function(){
                    if($scope.location === ''){
                        alert('Not found...');
                    } else {
                        var url = "https://api.forecast.io/forecast/7ce90a9cbabf8e10728551e92b826887/"+$scope.location+"?callback=JSON_CALLBACK";


                        $http.jsonp(url).success(function(data) {
                        $scope.title = "Weather for "+ $scope.location + "...";
                        $scope.weather = "Temperature is: " + data.currently.temperature + " degrees Fahrenheit.";
                        $scope.location = '';
                    });

                        $scope.coordinates = "Weather for: " + $scope.location;
                    }
                };
            }


            angular.module('weatherDirectives', []).
                directive('googlePlaces', function(){
                    return {
                        restrict:'E',
                        replace:true,
                        // transclude:true,
                        scope: {location:'='},
                        template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
                        link: function($scope, elm, attrs){
                        var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
                        google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        var place = autocomplete.getPlace();
                        $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                        $scope.$apply();
                            });
                        }
                    }
                });
