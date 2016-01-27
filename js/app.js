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
			title: data.name
		});
		google.maps.event.addListener(self.marker, 'click', function() {
			infowindow.setContent('<div><h5>'+self.name+'</h5></div><div>Address: '+self.address+'</div><div>Rating: '+self.rating+'</div>');
			infowindow.open(map, this);
		});
	}

	var locations = [];

	var seattle = {lat: 47.6097, lng: -122.3331};
	
	var map = new google.maps.Map(document.getElementById('map'), {
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
				  	locations.push((results[i]));
				}
				console.log(locations);
				viewModel.createList();
			}
		}

		

	// ViewModel
	var viewModel = {
		
		breweries: ko.observableArray([]),

		createList: function() {
			for(var x in locations) {
				viewModel.breweries.push(new Brewery(locations[x]));
			}
			console.log(viewModel.breweries());
		},

		query: ko.observable(''),

		displayMarkers: function() {
			for(var x in viewModel.breweries) {
				viewModel.breweries[x].marker.visible = true;
			}
		},

		search: function(value) {
			viewModel.removeMarkers();
			viewModel.breweries.removeAll();

			for(var x in locations) {
			    if(locations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
			      	viewModel.breweries.push(new Brewery(locations[x]));
			    } 
		  	}
		},

		addMarkers: function() {
			for(var i = 0; i < viewModel.breweries().length; i++) {
		    	viewModel.breweries()[i].marker.setMap(map); 
			};
		},

		removeMarkers: function() {
		  for(var i = 0; i < viewModel.breweries().length; i++) {
		    viewModel.breweries()[i].marker.setMap(null);
		  };
		},

		toggleBounce: function() {
			if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
			} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		},

		// Show and hide the filter input field and list of breweries.
		toggleList: function() {
			$("#map-container").toggleClass("col-md-12 col-md-9 col-xs-12 col-xs-3");
			$("#list-view").toggleClass("hidden");
		}
	}

	ko.applyBindings(viewModel);
	viewModel.query.subscribe(viewModel.search);
}


