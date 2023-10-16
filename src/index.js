// Initialize and add the map
let map;


async function initMap() {
    
    //create map
    const { Map } = await google.maps.importLibrary("maps");
    // below to create standard markers
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
 

    // The map, centered at Singpore on load
    var map = new Map(document.getElementById("map"), {
        zoom: 19,
        center: { lat: 1.3521, lng: 103.8198 },
        mapId: "5100c9e4073b9a44",
    });

    // create info window
    const infoWindow = new google.maps.InfoWindow();

    // to add obstacle markers onto map
    map.addListener("click", (mapsMouseEvent) => {
        // more efficient way, creating a library of icons
        const icons = {
            ok: {
                icon: "images/danger2.png"
            },
            ceo: {
                icon: "images/ceo.png"
            },
            monster: {
                icon: "images/monster.png"
            },
        };

        var danger_prompt = prompt("What is the obstacle type?")

        if(danger_prompt.length==0){
            alert("Put a bloody string you nougat!")
        }else{
            var danger_prompt_info = prompt("Share with us somemore details!!!")
            var danger_info = `
            <div>
                <h3>
                    Obstacle Type: <span class="${danger_prompt}">${danger_prompt}</span>
                </h3>
                <p>
                    ${danger_prompt_info}
                </p>
                <p>
                    double click marker to delete marker
                </p>
            </div>
            `
            //initialize marker on map
            var marker = new google.maps.Marker({
                position: mapsMouseEvent.latLng.toJSON(),
                map,
                content: danger_info,
                // title: danger_info,
                icon: icons[danger_prompt].icon,
            });
            // adding info window when u click that marker
            marker.addListener("click", () => {
                infoWindow.close();
                // infoWindow.setContent(marker.getTitle());
                infoWindow.setContent(marker.content);
                infoWindow.open(marker.getMap(), marker);
            });

            // to delete marker double click marker
            marker.addListener("dblclick", () => {
                marker.setMap(null);
            });
        }
        });

    // this below is to use ryan photo as marker
    var userPhoto = document.createElement("img");
    userPhoto.src = "images/Ryan_photo.jfif";
    userPhoto.id = "user-photo"

    // below code is to find ur start position and put photo of "user"
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            map.setCenter(pos);

            // The marker, positioned at location of user
            const your_location = new AdvancedMarkerElement({
                map: map,
                position: pos,
                content: userPhoto,
                title: "Your Location",
            });

            // click user icon to know current location
            your_location.addListener("click", () => {
                infoWindow.setPosition(pos);
                infoWindow.setContent(`<h2>Your Location</h2>`);
                infoWindow.open(map);
            });
            
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );


    new AutocompleteDirectionsHandler(map);
}


// handle map errors
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
}




class AutocompleteDirectionsHandler {
    map;
    originPlaceId;
    destinationPlaceId;
    travelMode;
    directionsService;
    directionsRenderer;
    constructor(map) {
        this.map = map;
        this.originPlaceId = "";
        this.destinationPlaceId = "";
        this.travelMode = google.maps.TravelMode.WALKING;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({draggable: true});
        this.directionsRenderer.setMap(map);

        const originInput = document.getElementById("origin-input");
        const destinationInput = document.getElementById("destination-input");
        const modeSelector = document.getElementById("mode-selector");
        // Specify just the place data fields that you need.
        const originAutocomplete = new google.maps.places.Autocomplete(
            originInput,
            { fields: ["place_id"] },
        );
        // Specify just the place data fields that you need.
        const destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput,
            { fields: ["place_id"] },
        );

        this.setupClickListener(
            "changemode-walking",
            google.maps.TravelMode.WALKING,
        );
        this.setupClickListener(
            "changemode-transit",
            google.maps.TravelMode.TRANSIT,
        );
        this.setupClickListener(
            "changemode-driving",
            google.maps.TravelMode.DRIVING,
        );
        this.setupChangeRouteListener();
        this.setupPlaceChangedListener(originAutocomplete, "ORIG");
        this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
            destinationInput,
        );
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    setupClickListener(id, mode) {
        const radioButton = document.getElementById(id);

        radioButton.addEventListener("click", () => {
            this.travelMode = mode;
            this.route();
        });
    }
    setupPlaceChangedListener(autocomplete, mode) {
        autocomplete.bindTo("bounds", this.map);
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.place_id) {
                window.alert("Please select an option from the dropdown list.");
                return;
            }

            if (mode === "ORIG") {
                this.originPlaceId = place.place_id;
            } else {
                this.destinationPlaceId = place.place_id;
            }

            this.route();
        });
    }
    setupChangeRouteListener() {
        const changeRouteButton = document.getElementById("change-route");
        changeRouteButton.addEventListener("click", () => {
            this.route(true);
        });
    }
    route(changeRoute = false) {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }

        const me = this;

        this.directionsService.route(
            {
                origin: { placeId: this.originPlaceId },
                destination: { placeId: this.destinationPlaceId },
                travelMode: this.travelMode,
                provideRouteAlternatives: true,
            },
            (response, status) => {
                if (status === "OK") {
                    if (changeRoute) {
                        console.log(response);
                        me.directionsRenderer.setDirections(response);
                        // me.directionsRenderer.setRouteIndex(2);
                    }
                    console.log(response);
                    me.directionsRenderer.setDirections(response);
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            },
        );
    }
}

window.initMap = initMap;
