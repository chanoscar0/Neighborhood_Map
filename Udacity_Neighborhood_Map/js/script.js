
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
var ViewModel = function(){
  var map;
  var markers = [];
  var self = this;
  self.filterOptions = ['None','Newport Beach','Anaheim','Los Angeles','San Diego'];
  self.currentFilter = ko.observable(this.filterOptions[0]);

  //Observable to hold selected input
  self.selectedFilter = ko.observable('');
  self.locationList = ko.observableArray([]);
    locations.forEach(function(locationItem){
      self.locationList.push(locationItem);
    });
  this.currentLocation = ko.observable(this.locationList()[0]);
  ViewModel.prototype.initMap = function(){
      map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 33.8366, lng:-117.9143},
        zoom: 13
      });
      var bounds = new google.maps.LatLngBounds();

      for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var city = locations[i].city;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          category: city,
          animation: google.maps.Animation.DROP,
          id: i
        });
        markers.push(marker);
        bounds.extend(markers[i].position);

      }
      map.fitBounds(bounds);

    }

  self.filteredItems = ko.computed(function(){
    var filter = self.selectedFilter();
    if(!filter || filter == "None"){
      return self.locationList()
    } else{
      return ko.utils.arrayFilter(self.locationList(), function(i){
        return i.city == filter;
      });
    }
  });

    self.setCurrentLocation = function(clickedLocation){
      self.currentLocation(clickedLocation);

    };

    self.setcurrentFilter = function(clickedFilter){
      self.currentFilter(clickedFilter);
    }
}
var VM = new ViewModel();

ko.applyBindings(VM);
