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

    
    // Create the DIV to hold the control.
    const BottomRightDiv = document.createElement("div");
    BottomRightDiv.setAttribute("id", "placemarkerCheckbox")
    // text infront of checkbox
    var place_marker_text = document.createTextNode("Place marker ")
    // Create the control.
    const BottomRight = createBottomRight(map);

    // Append the control to the DIV.
    BottomRightDiv.appendChild(place_marker_text)
    BottomRightDiv.appendChild(BottomRight);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(BottomRightDiv);


    // this below is to use ryan photo as marker
    var userPhoto = document.createElement("img");
    userPhoto.src = "images/Ryan_photo.jfif";
    userPhoto.id = "user-photo"

    // creating the info window for user
    let infoWindow = new google.maps.InfoWindow();

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


function createBottomRight(map) {
    const controlButton = document.createElement("input");
  
    // Set CSS for the control.
    controlButton.style.backgroundColor = "#fff";
    // controlButton.style.border = "200px solid #fff";
    // controlButton.style.borderRadius = "3px";
    // controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    // controlButton.style.color = "rgb(25,25,25)";
    controlButton.style.cursor = "pointer";
    controlButton.style.width = "20px";
    controlButton.style.height = "20px";
    // controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
    // controlButton.style.fontSize = "16px";
    // controlButton.style.lineHeight = "38px";
    controlButton.style.margin = "8px 10px 22px";
    controlButton.style.padding = "20px";
    // controlButton.style.textAlign = "center";
    // controlButton.textContent = "Place Markers";
    // controlButton.title = "Click to place obstacles on the map";
    controlButton.type = "checkbox";
    controlButton.id = "markerCheckbox"
    

    controlButton.addEventListener("click", () => {
        if (controlButton.checked==true){
            // create info window
            let infoWindow = new google.maps.InfoWindow();
            
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
                
                let modal = document.getElementById("modal_button");
                let place_marker = document.getElementById("place_marker")
                modal.click();

                place_marker.addEventListener("click", () => {
                    var obstacle_type = document.getElementById("obstacle_type").value
                    var obstacle_info = document.getElementById("obstacle_info").value
                    var obstacle_details = document.getElementById("obstacle_details").value
                

                    let danger_info = `
                    <div>
                        <h3>
                            Obstacle Type: <span class="${obstacle_type}">${obstacle_info}</span>
                        </h3>
                        <p>
                            ${obstacle_details}
                        </p>
                        <p>
                            double click marker to delete marker
                        </p>
                    </div>
                    `
                    //initialize marker on map
                    let marker = new google.maps.Marker({
                        position: mapsMouseEvent.latLng.toJSON(),
                        map,
                        content: danger_info,
                        // title: danger_info,
                        icon: icons[obstacle_type].icon,
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
                
                    document.getElementById("exampleModal").innerHTML = `
                    <div id="modal-form" class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-10 fw-bold " id="exampleModalLabel">Place marker</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form>
                        <div class="modal-body">
                            
                            <div class="container-fluid">

                                <div class="row">
                                <div class="col-md-4">Marker Icon</div>
                                <div class="col-md-4 ms-auto"></div>
                                </div>

                                <div class="row">
                                    <div class="col-md-4">IMAGE HErE</div>
                                    <div class="col-md-8">

                                        <select class="form-select" aria-label="Default select example" id="obstacle_type">
                                            <option selected>Obstacle</option>
                                            <option value="monster">monster</option>
                                            <option value="ok">ok</option>
                                            <option value="ceo">ceo</option>
                                        </select>

                                    </div>
                                </div>

                            </div>

                            What is the obstacle type
                            <input type="text" class="form-control" id="obstacle_info">
                            <br>
                            Share with us somemore details!!!
                            <textarea class="form-control" id="obstacle_details"></textarea>

                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="place_marker" data-bs-dismiss="modal">Place Marker</button>
                            
                        </div>
                        

                    </div>
                </div>
                    `
                })          
            });
            
        }else{
            google.maps.event.clearListeners(map, 'click');
        }
    
    });
    return controlButton;
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
