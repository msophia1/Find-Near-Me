var myApp = angular.module("myApp", []);
var map, infoWindow;
myApp.directive("myMaps",function(){
    return{
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function ( scope, element, attrs){
            var myLatlng = new google.maps.LatLng(28.070011,83.24939);
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
    $scope.productList = [
        "shampoo","conditioner","soap","body wash","face wash","body cream","face cream","body lotion","hair spray"];
    $scope.complete = function(string) {
        var output = [];
        angular.forEach($scope.productList, function(product){
           if(product.toLowerCase().indexOf(string.toLowerCase())>=0) {
               output.push(product);
           } 
        });
        $scope.filterProduct = output;
    }
    $scope.fillTextbox = function(string) {
        $scope.product = string;
        $scope.hidethis = true;
    }
    
    $scope.findMe = function() {
        console.log("Inside Custom.");
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
    
    $scope.codeAddress = function() {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        console.log("I am here");
        var myLatlng = new google.maps.LatLng(-34.397, 150.644);
        var mapOptions = {
            zoom: 8,
            center: myLatlng
        }
        var map;
        map = new google.maps.Map(document.getElementById('maps_style'), mapOptions);
        console.log("In codeAddress");
        var address = document.getElementById('address').value;
        console.log(address);
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
            console.log(results[0].geometry.location);
        });    
    }
    
    $scope.searchCriteria = function() {
        var address = document.getElementById('address').value;
        var searchfor = document.getElementById('searchfor').value;
        var geocoder = new google.maps.Geocoder();
        
        if(searchfor === ''){
            searchfor = 'airport';
        }
        
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //alert("Latitude: "+results[0].geometry.location.lat());
                //alert("Longitude: "+results[0].geometry.location.lng());
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
                  type:'gym'
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
        center: {lat: -34.397, lng: 150.644},
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