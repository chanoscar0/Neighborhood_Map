var map;
var markers = [];
var locations = [
  {title: 'Disneyland Park', location: {lat: 33.812511, lng: -117.918976}},
  {title: 'Universal Studios', location: {lat: 34.1381, lng: -118.3534}},
  {title: 'Angel Stadium', location: {lat: 33.8366, lng: -117.9143}},
  {title: 'Dodgers Stadium', location: {lat: 34.0739, lng: -118.2400}},
  {title: 'Staples Center', location: {lat: 34.0430, lng: -118.2673}},
  {title: 'Fashion Island', location: {lat: 33.6159, lng: -117.8758}},
  {title: 'SeaWorld', location: {lat: 33.468986, lng: -117.673389}},
  {title: 'LegoLand', location: {lat: 33.126205, lng: -117.311606}}
];
function initMap(){
  map = new google.maps.Map(document.getElementById('googleMap'), {
    center: {lat: 33.8366, lng:-117.9143},
    zoom: 13
  });
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    markers.push(marker);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);

}
var Location = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
}
var ViewModel = function(){
  var self = this;
  this.locationList = ko.observableArray([]);
    locations.forEach(function(locationItem){
      self.locationList.push(new Location(locationItem));
    });

    this.currentLocation = ko.observable(this.locationList()[0]);

    self.setCurrentLocation = function(clickedLocation){
      self.currentLocation(clickedLocation);
    };

}
ko.applyBindings(new ViewModel());
