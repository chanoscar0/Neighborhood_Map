# Neighborhood_Map
Neighborhood Map Application that demonstrates capabilities with APIs and MVC Frameworks. The application includes a menu on the left of the screen to help filter the markers and infowindows that appear on the google map that is in the right section of the screen. This application was meant to serve information from various APIs on the web through the Google Maps application to the user. I decided to use the Foursquare API to serve this information.

# Purpose

The purpose of this project was for a part of the Udacity Full Stack Web Developer Course. The purpose of this project was to demonstrate my understanding of Full-stack development, from Authentication vs. Authorization, to the Back-end routing of a web application, to the front-end styling templates and how all of them interact and connect with one another to make a fully functional web application.

# Running the Application

In order to run the application, just open the index.html file in a web browser.

The purpose of this application is to showcase some landmarks within the Southern California Area, while using the Google Maps API, and Foursquare API to display some information.

All of the information in the pop-up window was drawn from the Foursquare API.

# Technologies
- Knockout.js (MVVM Framework)
- Bootstrap (Front-end)
- GoogleMaps API (Google Maps functionality)
- Foursquare API
- Javascript (AJAX)

# Challenges

One of the primary challenges I had with this project was the organization in the MVVM framework. I found it hard at times to figure out which methods needed to be split out from the View Model, especially around the objects that were contained on the Google Map. When I updated markers and infowindows on the viewmodel, they were not synchronized with the map. In order to work around this, I used an array to store the markers so that whenever they got updated in the viewmodel, I could reflect the change in the live google map.

Another challenge that I faced was around the filtering of the list elements. I found it a bit challenging to set the current location appropriately based off of the list, but I got around this by using a computed function in the Knockout Framework to apply the filter to the list elements.

# Screenshot

![](https://github.com/chanoscar0/Neighborhood_Map/blob/master/Screen%20Shot%202018-02-21%20at%2012.57.05%20PM.png)


