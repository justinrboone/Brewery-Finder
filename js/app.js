
// Model
var Brewery = function(data) {
	var self = this;
	self.name = data.name;
	self.address = data.vicinity;
	self.rating = data.rating;
	self.infowindow = new google.maps.InfoWindow();
	self.marker = new google.maps.Marker({
		position: data.geometry.location,
		map: map,
		animation: google.maps.Animation.DROP,
		title: data.name
	});
	google.maps.event.addListener(self.marker, 'click', function() {
		infowindow.setContent('<div><h5>'+self.name+'</h5></div><div>Address: '+self.address+'</div><div>Rating: '+self.rating+'</div>');
		infowindow.open(map, this);
	});
}

var seattle = {lat: 47.6097, lng: -122.3331};
var map;

// ViewModel
var viewModel = function() {
	var self = this;
	self.breweries = ko.observableArray([]);

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

	function callback(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
			  	self.breweries.push(new Brewery(results[i]));
			}
		}
	}

	toggleBounce = function() {
		if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
		} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}

	// Show and hide the filter input field and list of breweries.
	toggleList = function() {
		$("#map-container").toggleClass("col-md-12 col-md-9 col-xs-12 col-xs-3");
		$("#list-view").toggleClass("hidden");
	}
}



var init = function() {
	ko.applyBindings(new viewModel());
}



