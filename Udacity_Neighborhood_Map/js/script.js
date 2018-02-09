var map;
var markers = [];
var locations = [
  {title: 'Disneyland Park', location: {lat: 33.812511, lng: -117.918976}, city: 'Anaheim'},
  {title: 'Universal Studios', location: {lat: 34.1381, lng: -118.3534}, city: 'Los Angeles'},
  {title: 'Angel Stadium', location: {lat: 33.8366, lng: -117.9143}, city: 'Anaheim'},
  {title: 'Dodgers Stadium', location: {lat: 34.0739, lng: -118.2400}, city: 'Los Angeles'},
  {title: 'Staples Center', location: {lat: 34.0430, lng: -118.2673}, city: 'Los Angeles'},
  {title: 'Fashion Island', location: {lat: 33.6159, lng: -117.8758}, city: 'Newport Beach'},
  {title: 'SeaWorld', location: {lat: 33.468986, lng: -117.673389}, city: 'San Diego'},
  {title: 'LegoLand', location: {lat: 33.126205, lng: -117.311606}, city: 'San Diego'}
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
  this.city = ko.observable(data.city);
}
var ViewModel = function(){
  var self = this;
  //Filter options in the drop-down menu
  self.filterOptions = ['None','Newport Beach','Anaheim','Los Angeles','San Diego'];

  //Observable to hold selected input
  self.selectedFilter = ko.observable('');
  self.locationList = ko.observableArray([]);
    locations.forEach(function(locationItem){
      self.locationList.push(new Location(locationItem));
    });
    //Computation for deciding which locations to show based on the filters
  self.filteredItems = ko.computed(function(){
    var filter = self.selectedFilter();
    if(!filter || filter == "None"){
      return self.locationList()
    } else{
      return ko.utils.arrayFilter(self.locationList(), function(i){
        return i.city() == filter;
      });
    }
  });

    this.currentLocation = ko.observable(this.locationList()[0]);

    self.setCurrentLocation = function(clickedLocation){
      self.currentLocation(clickedLocation);
    };
    self.currentFilter = ko.observable(this.filterOptions[0]);

    self.setcurrentFilter = function(clickedFilter){
      self.currentFilter(clickedFilter);
    }
    console.log(this.selectedFilter());
}
ko.applyBindings(new ViewModel());
