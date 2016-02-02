function app() {
	
	// Create brewery objects.
	var Brewery = function(data) {
		var self = this;
		self.name = data.name;
		self.address = data.vicinity;
		self.rating = data.rating;
		self.marker = new google.maps.Marker({
			position: data.geometry.location,
			map: map,
			animation: null,
			title: data.name
		});
		
		// Create the infowindow content and activate it when a marker is clicked.
		google.maps.event.addListener(self.marker, 'click', function() {
			infowindow.setContent('<div><img src="https://maps.googleapis.com/maps/api/streetview?size=300x150&location='+self.address+'"></div><div><h5>'+self.name+'</h5></div><div>Address: '+self.address+'</div><div>Rating: '+self.rating+'</div>');
			map.panTo(self.marker.getPosition());
			infowindow.open(map, this);
		    self.marker.setAnimation(google.maps.Animation.BOUNCE);
		    setTimeout(function(){ self.marker.setAnimation(null) }, 3000);
		});
	}

	// Create an array to store data from Google.
	var locations = [];

	// Set location for center of map and search.
	var seattle = {lat: 47.6097, lng: -122.3331};
	
	// Create the map.
	var map = new google.maps.Map(document.getElementById('map'), {
		center: seattle,
		zoom: 11,
		scrollwheel: false
		});

	// Create Info Windows.
	infowindow = new google.maps.InfoWindow();

	// Request Places data from Google.
	var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: seattle,
			radius: 20000,
			keyword: ['brewery']
		}, callback);

	// Add Places data to the model (locations array) after it is received.
	function callback(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
			  	locations.push((results[i]));
			}
			viewModel.createList();
		}
	}

	// Set height of map and list-view divs to viewport height
	function windowH() {
	   var wH = $(window).height();

	   $('#map-container, #list-view').css({height: wH});
	}



	// ViewModel
	var viewModel = {
		
		// Create a list of breweries
		breweries: ko.observableArray([]),

		// Temporarily store input from list filter
		query: ko.observable(''),

		// Create Brewery objects from the Google places data and add them to the list.
		createList: function() {
			for(var x in locations) {
				viewModel.breweries.push(new Brewery(locations[x]));
			}
		},

		// Filter the brewery list and map markers based on user input.
		search: function(value) {
			viewModel.removeMarkers();
			viewModel.breweries.removeAll();

			for(var x in locations) {
			    if(locations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
			      	viewModel.breweries.push(new Brewery(locations[x]));
			    } 
		  	}
		},

		// Activate the appropriate map marker and infowindow.
		activateMarker: function() {
			google.maps.event.trigger(this.marker, 'click');
		},

		// Remove all markers from the map.
		removeMarkers: function() {
		  for(var i = 0; i < viewModel.breweries().length; i++) {
		    viewModel.breweries()[i].marker.setMap(null);
		  };
		},

		// Show and hide the filter input field and list of breweries.
		toggleList: function() {
			$("#map-container").toggleClass("col-md-12 col-md-9 col-xs-12 col-xs-3");
			$("#list-view").toggleClass("hidden");
		}
	}

	windowH();	
	ko.applyBindings(viewModel);
	viewModel.query.subscribe(viewModel.search);

}


