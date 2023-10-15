function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        mapTypeControl: false,
        center: { lat: 1.297454623220471, lng: 103.84956272470986 },
        zoom: 19,
    });

    map.addListener("click", (mapsMouseEvent) => {
        new google.maps.Marker({
            position: mapsMouseEvent.latLng.toJSON(),
            map,
            title: "Caution",
        });
    });

    new AutocompleteDirectionsHandler(map);
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
                    //alternate routes
                    let alternateRouteEl = document.getElementById("alternate-routes")
                    for (let i=0; i<response.routes.length; i++) {
                        let header = document.createElement("h5")
                        let ol = document.createElement("ol")
                        header.innerHTML = `Route ${i+1}`

                        response.routes[i].legs[0].steps.forEach((step, index) => {
                            let li = document.createElement("li")
                            li.innerHTML = step.instructions

                            //if travel mode is transit, we add additional info about the transit
                            if (step.transit){
                                step.transit.line.vehicle.type == "BUS" ? li.innerHTML += ` | Bus: ${step.transit.line.name} Heading Towards ${step.transit.headsign}` : li.innerHTML += ` | Train: ${step.transit.line.name} Heading Towards ${step.transit.headsign}`
                            }

                            ol.appendChild(li)
                            
                        })

                        alternateRouteEl.appendChild(header)
                        alternateRouteEl.appendChild(ol)
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
