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
        this.directionsRenderer = new google.maps.DirectionsRenderer({ draggable: true });
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
        //save routes and load routes
        this.setUpSaveRouteListener();
        this.setUpLoadRouteListener();
        //testing
        this.loadDefault()
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
    
    //switch to another route and make it active
    switchRoute(routeIndex) {
        this.directionsRenderer.setRouteIndex(routeIndex);
    }

    //save route
    saveRoute(routeData) {
        localStorage.setItem("customRoute", JSON.stringify(routeData))
        if (routeData.routes[0].legs[0].via_waypoints){
            let waypoints = JSON.stringify(routeData.request.waypoints)
            localStorage.setItem("waypoints", waypoints)
            console.log(waypoints)
        }
        console.log(routeData)
        console.log("saved your custom route")
    }

    //load saved routes
    loadRoute() {
        let savedRoute = localStorage.getItem("customRoute")

        if (savedRoute) {
            let parsedSavedRoute = JSON.parse(savedRoute);
            console.log(parsedSavedRoute)

            if(parsedSavedRoute.request.waypoints){
                let parsedWaypoints = JSON.parse(localStorage.getItem("waypoints"))
                console.log(parsedWaypoints)
                console.log(parsedSavedRoute.request.origin.placeId)

                this.directionsService.route(
                    {
                        origin: parsedSavedRoute.request.origin,
                        destination: parsedSavedRoute.request.destination,
                        travelMode: google.maps.DirectionsTravelMode.WALKING,
                        waypoints: parsedWaypoints
                    },
                    (result) => {
                        this.directionsRenderer.setDirections(result)
                    }
                
                )
                
            }
            else {
                this.directionsRenderer.setDirections(parsedSavedRoute)
                console.log("normal route")
            }
            
        }
        else {
            console.log("No custom route found in local storage.");
        }
    }
    //testing
    loadDefault() {
        let loadDefaultBtn = document.getElementById("load-default")

        loadDefaultBtn.addEventListener("click", ()=> {
            let saved = localStorage.getItem("default")
            if (!saved){
                var defaultRoute = JSON.stringify(this.directionsRenderer.getDirections())
                localStorage.setItem("default", defaultRoute)
            }
            else {
                this.directionsRenderer.setDirections(JSON.parse(saved))
            }
        })
    }
    //handle the save routes
    setUpSaveRouteListener() {
        let saveRouteBtn = document.getElementById("save-route")

        saveRouteBtn.addEventListener("click", () => {
            let routeData = this.directionsRenderer.getDirections()
            this.saveRoute(routeData)
        })
    }

    //handle the load routes
    setUpLoadRouteListener() {
        let loadRouteBtn = document.getElementById("load-route")

        loadRouteBtn.addEventListener("click", () => {
            this.loadRoute()
        })
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
                    }
                    //populating alternate routes header
                    let alternateRouteEl = document.getElementById("alternate-routes")
                    for (let i = 0; i < response.routes.length; i++) {
                        let header = document.createElement("h5")
                        let ol = document.createElement("ol")
                        header.innerHTML = `Route ${i + 1}`

                        //create new button to put beside header
                        let switchButton = document.createElement("button");
                        switchButton.innerText = "Switch Route";
                        switchButton.addEventListener("click", () => {
                            this.switchRoute(i);
                        });


                        response.routes[i].legs[0].steps.forEach((step, index) => {
                            let li = document.createElement("li")
                            li.innerHTML = step.instructions

                            //if travel mode is transit, we add additional info about the transit
                            if (step.transit) {
                                step.transit.line.vehicle.type == "BUS" ? li.innerHTML += ` | Bus: ${step.transit.line.name} Heading Towards ${step.transit.headsign}` : li.innerHTML += ` | Train: ${step.transit.line.name} Heading Towards ${step.transit.headsign}`
                            }


                            ol.appendChild(li)
                        })

                        // add everything to the DOM
                        alternateRouteEl.appendChild(header)
                        alternateRouteEl.appendChild(switchButton)
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
