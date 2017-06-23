var myApp = angular.module("myApp", []);
var map, infoWindow;
myApp.directive("myMaps",function(){
    return{
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function ( scope, element, attrs){
            var myLatlng = new google.maps.LatLng(39.2904,76.6122);
            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.Map.ROADMAP
            }
            map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Coffee Near me'
            });
            marker.setMap(map);
        }
    };
    
});

myApp.controller("mainController", function($scope) {
    $scope.findMe = function() {
        map = new google.maps.Map(document.getElementById('maps_style'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;
        //Try HTML5 geolocation.
        if (true) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: 41.881832,
                    lng: -87.623177
                };
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());

            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }
    
    $scope.searchCriteria = function() {
        var address = document.getElementById('address').value;
        var searchfor = document.getElementById('searchfor').value;
        console.log("address:" +address);
        console.log("searchfor:" +searchfor);
        var geocoder = new google.maps.Geocoder();
        
        if(searchfor === ''){
            searchfor = 'airport';
        }
        
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var pyrmont = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                map = new google.maps.Map(document.getElementById('maps_style'), {
                  center: pyrmont,
                  zoom: 15
                });

                infowindow = new google.maps.InfoWindow();
                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                  location: pyrmont,
                  radius: 500,
                  type: searchfor
                }, callback);
            } 
            else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }
});

function initMap() {
    map = new google.maps.Map(document.getElementById('maps_style'), {
        center: {lat: 39.2904, lng: 76.6122},
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
    }, function() {
        handleLocationError(true, infoWindow, map.getCenter());

        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                  'Error: The Geolocation service failed.' :
                  'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
} 

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("inside callback");
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
      }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map, 
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
}