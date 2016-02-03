// Display error message if Google Maps API call fails.
function googleError() {
	$('#map').append('<div class="alert alert-danger center-block" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><strong> Oh snap!</strong> There was an error loading map data.</div>')
}

function app() {
	
	// Create brewery objects.
	var Brewery = function(data) {
		var self = this;
		self.name = data.name;
		self.address = data.location.address;
		self.checkins = data.stats.checkinsCount;
		self.lat = data.location.lat;
		self.lng = data.location.lng;
		self.url = data.url;
		self.marker = new google.maps.Marker({
			position: {lat: self.lat, lng: self.lng},
			map: map,
			animation: null,
			title: data.name
		});

		
		// Create the infowindow content and activate it when a marker is clicked.
		google.maps.event.addListener(self.marker, 'click', function() {
			infowindow.setContent('<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">'+self.name+'</h3></div><div class="panel-body"><h5>Address: '+self.address+'</h5><h5>Website: <a href="'+self.url+'">'+self.url+'</a></h5><h5>Foursquare Check-ins: '+self.checkins+'</h5></div></div>');
			map.panTo(self.marker.getPosition());
			infowindow.setOptions({
				maxWidth: 300
			});
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
		zoom: 12,
		scrollwheel: false
		});

	// Create Info Windows.
	infowindow = new google.maps.InfoWindow();

	// Request data from Foursquare and handle errors	
	function loadData() {
		$.getJSON('https://api.foursquare.com/v2/venues/search?client_id=M5RGL2VT40CIJUOT1MMW1PVDAQPMQDUWDVB0F4XP3S32KBWP&client_secret=KY4UKIQI1HMVBBKXGOV2IRQJ4VTNJ2X2EOWOUAU32YQDASIG&v=20130815&near=Seattle, WA&&radius=5000&query=brewery&sortByDistance=1', function(data) {
		  	for(var i = 0; i < data.response.venues.length; i++) {
		  		locations.push(data.response.venues[i]);
		  	}
		  	viewModel.createList();
		}).error(function(e) {
			viewModel.toggleList();
			$('#list-view').append('<div class="alert alert-danger center-block" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><strong> Oh snap!</strong> There was an error loading locations data.</div>');
		});
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

			$('#hamburger-btn').prepend('<span class="badge">'+viewModel.breweries().length+'</span>')
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

	loadData();
	windowH();	
	ko.applyBindings(viewModel);
	viewModel.query.subscribe(viewModel.search);

}


