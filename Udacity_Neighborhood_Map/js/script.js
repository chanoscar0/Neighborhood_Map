var locations = [
  {title: 'Disneyland Park', location: {lat: 33.8121, lng: -117.9190}, city: 'Anaheim'},
  {title: 'Universal Studios', location: {lat: 34.138, lng: -118.353}, city: 'Los Angeles'},
  {title: 'Angel Stadium', location: {lat: 33.80003, lng: -117.883043}, city: 'Anaheim'},
  {title: 'Staples Center', location: {lat: 34.0430, lng: -118.2673}, city: 'Los Angeles'},
  {title: 'Fashion Island', location: {lat: 33.6159, lng: -117.8758}, city: 'Newport Beach'},
  {title: 'SeaWorld', location: {lat: 32.7648, lng: -117.2266}, city: 'San Diego'},
  {title: 'LegoLand', location: {lat: 33.126205, lng: -117.311606}, city: 'San Diego'}
];

function googleMapsFail(){
  alert ("Google Maps failed to load, please refresh and try again.");
}
var ViewModel = function(){
  //Set all variables for globals that will be needed
  var map;
  var bouncingMarker = null;
  var contentString;
  var imageString;
  var venueID;
  var markers = [];
  var self = this;
  self.filterOptions = ['None','Newport Beach','Anaheim','Los Angeles','San Diego'];
  self.currentFilter = ko.observable(this.filterOptions[0]);
  //Observable to hold selected input
  self.selectedFilter = ko.observable('');
  //Add locations into the oberservable array locationlist
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
        self.locationList()[i].marker = marker;
        addListeners(marker,infoWindow);
      }

      function addListeners(marker, infowindow){
        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
            });
        marker.addListener('click', function(){
          if(bouncingMarker)
            bouncingMarker.setAnimation(null);
          if(bouncingMarker != this) {
            this.setAnimation(google.maps.Animation.BOUNCE);
            bouncingMarker = this;
          }else{
              bouncingMarker = null;
          }
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
        var lat =0;
        var lng = 0;
        for (var i =0; i < locations.length; i++){
          if (marker.title == locations[i].title){
            lat = locations[i].location.lat;
            lng = locations[i].location.lng;
          }
        }
        var foursquareURLSearch = 'https://api.foursquare.com/v2/venues/search?';
        var clientID = 'WDOUKNQBEJPN0T1APND43KYKGEHI2SGPMG5RH3EUG4MDSA5O';
        var clientSecret = "5SNYDXL0BZNGWZP5XEQZGLWLCZ04FMTS3GNYS4HGLSGF0D54";
        //outer Ajax method to find the location's address and information
        $.ajax({
          url: foursquareURLSearch,
          dataType: 'json',
          data: 'll=' + lat + ',' + lng +
                '&limit=1' +
                '&client_id=' + clientID +
                '&client_secret=' + clientSecret +
                '&v=20170801' +
                '&m=foursquare',
          async: true,
          //If server is reachable, dissect the JSON response to the information we need
          success: function(data){
            console.log('hi');
            venueID = data.response.venues[0].id;
            var result = data.response.venues[0];
            var locationName = result.name;
            var locationFormattedAddress = result.location.formattedAddress;
            contentString = locationName + ' is located at ' +
            locationFormattedAddress[0] +' ' + locationFormattedAddress[1] +
            ' ' + locationFormattedAddress[2];
            contentString = "<div>" + contentString + "</div>";
            /*Inner AJAX function that uses the venueID we get from the outer
            function, to get the photos from the foursquare API. The response is
            then processed, and used to populate the infoWindow
            */
            $.ajax({
              url: "https://api.foursquare.com/v2/venues/" + venueID + "/photos?",
              dataType: 'json',
              data: '&client_id=' + clientID +
                    '&client_secret=' + clientSecret +
                    '&v=20170801' +
                    '&m=foursquare',
              async: true,

              success: function(data){
                console.log('hi');
                if (data.response.photos.items.length === 0){
                  alert("Sorry, we could not load photo for this location.");
                } else{
                  var resultPhotos = data.response.photos.items[0];
                  var prefix = resultPhotos.prefix;
                  var suffix = resultPhotos.suffix;
                  var width = resultPhotos.width;
                  var height = resultPhotos.height;
                  imageString = prefix + '100x100' + suffix;
                  imageString = "<div style = float:left;> <img src = " +
                                imageString + "></div>";
                  contentString = imageString + contentString;
                  if (infowindow.marker != marker) {
                    infowindow.marker = marker;
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                    /* Make sure the marker property is cleared if the
                    infowindow is closed.*/
                    infowindow.addListener('closeclick', function() {
                      infowindow.marker = null;
                    });
                }
              }
            },
              error: function(jqXHR, textStatus){
                console.log('hi');
                contentString = "Sorry, we could not load the photos from Foursquare <br><br>" + contentString;
                infowindow.setContent(contentString);
                infowindow.open(map, marker);

              }
            });
          },
          //If foursquare is not reachable, alert that an error has occurred.
          error: function(jqXHR, textStatus){
            console.log('hi');
            infowindow.setContent("Error, we could not load the fourSquare data for this location.");
            infowindow.open(map, marker);

          }
      });
    }
      //Function for showing all markers on a map on load.
      function showLocations() {
            // Extend the boundaries of the map for each marker and display the marker
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
            }
            //fit map to the markers
            map.fitBounds(bounds);
      }
      //Function for hiding markers on the map
      function hideLocations(){
        //Hide all the markers on the map
        for (var i=0; i <markers.length; i++) {
          markers[i].setMap(null);
        }
      }
      showLocations();
      //Function used to make the customer markers with colors.
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

    };
//computed function in knockout to display the filtered or unfiltered list
  self.filteredItems = ko.computed(function(){
    var filter = self.selectedFilter();
    if(!filter || filter == "None"){
      return self.locationList();
    } else{
      return ko.utils.arrayFilter(self.locationList(), function(i){
        return i.city == filter;
      });
    }
  });
  //filter markers to match the filtered list
    self.filterMarkers = function(category){
      for (i = 0; i < markers.length; i++) {
        marker = markers[i];
        // If is same category or category not picked

        if(marker.category == self.selectedFilter() || self.selectedFilter() == "None"){
            marker.setVisible(true);
        }
        // Categories don't match
        else {
            marker.setVisible(false);
        }
    }
  };
    //Set's current location
    self.setCurrentLocation = function(clickedLocation){
      self.currentLocation(clickedLocation);
      try {
        google.maps.event.trigger(clickedLocation.marker, 'click');
      }
      catch(err) {
        alert("Google Maps could not load, please refresh and try again. Check your URL.");
      }
};   //Set's current filter
    self.setcurrentFilter = function(clickedFilter){
      self.currentFilter(clickedFilter);
    };
};
var VM = new ViewModel();

ko.applyBindings(VM);
