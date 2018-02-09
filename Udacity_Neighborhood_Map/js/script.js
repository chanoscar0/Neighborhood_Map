
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
  //Set all variables for globals that will be needed
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

  //Begin constructing the Map and toying with markers
  ViewModel.prototype.initMap = function(){
      map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 33.8366, lng:-117.9143},
        zoom: 13
      });
      var bounds = new google.maps.LatLngBounds();
      var infoWindow = new google.maps.InfoWindow();
      var defaultIcon = makeMarkerIcon("E3E8F8");
      var highlightedIcon = makeMarkerIcon("203562");


      for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var city = locations[i].city;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          category: city,
          animation: google.maps.Animation.DROP,
          id: i,
          icon: defaultIcon
        });
        markers.push(marker);
        marker.addListener('click', function() {
          populateInfoWindow(this, infoWindow);
        });

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
          this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
          this.setIcon(defaultIcon);
        });
      }
      function populateInfoWindow(marker, infowindow){
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
      }
    }
      function showLocations() {
            // Extend the boundaries of the map for each marker and display the marker
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
            }
            map.fitBounds(bounds);
      }
      function hideLocations(){
        //Hide all the markers on the map
        for (var i=0; i <markers.length; i++) {
          markers[i].setMap(null);
        }
      }
      showLocations();

      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }
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
