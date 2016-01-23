// Initialize the app
function init() {
	var map;
	var infowindow;

	function Brewery(data) {
		this.name = data.name;
		this.address = data.formatted_address;
		this.rating = data.rating;
		this.infowindow = {};
		this.marker = {};
	}

	function listViewModel() {
		breweries = ko.observableArray();
		console.log(breweries());
	}

	function initMap() {
	  var seattle = {lat: 47.6097, lng: -122.3331};

	  map = new google.maps.Map(document.getElementById('map'), {
	    center: seattle,
	    zoom: 12,
	    scrollwheel: false
	  });

	  infowindow = new google.maps.InfoWindow();

	  var service = new google.maps.places.PlacesService(map);
	  service.nearbySearch({
	    location: seattle,
	    radius: 7500,
	    keyword: ['brewery']
	  }, callback);
	}

	function callback(results, status) {
	  if (status === google.maps.places.PlacesServiceStatus.OK) {
	    for (var i = 0; i < results.length; i++) {
	      createMarker(results[i]);
	      var brewery = new Brewery(results[i]);
	      breweries().push(brewery);
	    }
	  }
	}

	function createMarker(place) {
	  var placeLoc = place.geometry.location;
	  var marker = new google.maps.Marker({
	    map: map,
	    position: place.geometry.location,
	    animation: google.maps.Animation.DROP,
	    title: place.name
	  });

	  google.maps.event.addListener(marker, 'click', function() {
	    infowindow.setContent('<div><h5>'+place.name+'</h5></div><div>Address: '+place.vicinity+'</div><div>Rating: '+place.rating+'</div>');
	    infowindow.open(map, this);
	  });
	}

	function toggleBounce() {
	  if (marker.getAnimation() !== null) {
	    marker.setAnimation(null);
	  } else {
	    marker.setAnimation(google.maps.Animation.BOUNCE);
	  }
	}

	initMap();
	ko.applyBindings(new listViewModel);
}

// Show and hide the filter input field and list of breweries.
function toggleList() {
  $("#map-container").toggleClass("col-md-12 col-md-9 col-xs-12 col-xs-3");
  $("#list-view").toggleClass("hidden");
}