const root = Vue.createApp({
    data() {
        return {
            username: "mr.rollerman", // Will update this based on login
            profilePicUrl: "images/Ryan_photo.jfif",
            markersPlaced: 0,
            routesSaved: 0
        }
    }
});

root.mount("#root");

// Initialize and add the map
let map;


// base template for modal form
var modal_form_class = `
<div id="modal-form" class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-10 fw-bold" id="exampleModalLabel">Place a marker</h1>
            <button id="modal_close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form>
        <div class="modal-body">
            
            <div class="container-fluid">

                <div class="row">
                <div class="col-md-4">Marker Icon</div>
                <div class="col-md-4 ms-auto"></div>
                </div>

                <div class="row">
                    <div class="col-md-4">
                        <img id="image" src="images/monster.png">
                    </div>
                    <div class="col-md-8">

                        <select class="form-select" aria-label="Default select example" id="obstacle_type">
                            <!-- <option selected>Obstacle</option> -->
                            <option value="monster" selected>monster</option>
                            <option value="danger">danger</option>
                            <option value="pothole">pothole</option>
                        </select>

                    </div>
                </div>

            </div>

            What is the obstacle name
            <input type="text" class="form-control" id="obstacle_info">
            <br>
            Share with us somemore details!!!
            <textarea class="form-control" id="obstacle_details"></textarea>

        </div>

        <div class="modal-footer">
            <button type="button" class="btn fw-bold text-light" id="place_marker" data-bs-dismiss="modal" style="background-color: #3E837A;">Place Marker</button>
        </div>
        

    </div>
</div>`;

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

    markers.on('value', gotData)

    function gotData(data) {
        if (data.val()) {
            var marker = data.val()
            var keys = Object.keys(marker)
            let i = 0
            for (i = 0; i < keys.length; i++) {
                CreateMarkers(marker[keys[i]].position, marker[keys[i]].content, marker[keys[i]].icon)

            }
        }
    }

    function CreateMarkers(position, content, icon) {

        let marker = new google.maps.Marker({
            position: position,
            map,
            content: content,
            // title: danger_info,
            icon: icon,

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
            let akey = position.lat.toString() + position.lng.toString()
            let iden = akey.split('.').join('')
            DeleteMarker(iden);
        })
    }
    // Create the DIV to hold the control.
    const BottomRightDiv = document.createElement("div");
    BottomRightDiv.setAttribute("id", "placemarkerCheckbox")
    // text infront of checkbox
    var place_marker_text = document.createTextNode("Place Markers ")
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

// creates place marker checkbox
function createBottomRight(map) {
    const controlButton = document.createElement("input");

    // Set CSS for the control.
    // controlButton.style.backgroundColor = "#fff";
    // controlButton.style.border = "200px solid #fff";
    // controlButton.style.borderRadius = "3px";
    // controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    // controlButton.style.color = "rgb(25,25,25)";
    // controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
    // controlButton.style.fontSize = "16px";
    // controlButton.style.lineHeight = "38px";
    // controlButton.style.margin = "8px 10px 22px";
    // controlButton.style.padding = "20px";
    // controlButton.style.textAlign = "center";
    // controlButton.textContent = "Place Markers";
    // controlButton.title = "Click to place obstacles on the map";
    controlButton.style.width = "20px";
    controlButton.style.height = "20px";
    controlButton.style.cursor = "pointer";
    controlButton.type = "checkbox";
    controlButton.id = "markerCheckbox"
    controlButton.style.verticalAlign = "middle"


    controlButton.addEventListener("click", () => {
        if (controlButton.checked == true) {
            // create info window
            let infoWindow = new google.maps.InfoWindow();

            // to add obstacle markers onto map
            map.addListener("click", (mapsMouseEvent) => {
                // more efficient way, creating a library of icons
                const icons = {
                    danger: {
                        icon: "images/danger.png"
                    },
                    pothole: {
                        icon: "images/pothole.png"
                    },
                    monster: {
                        icon: "images/monster.png"
                    },
                };

                // access modal button which is invisible
                let modal = document.getElementById("modal_button");
                // accessing modal place marker button
                let place_marker = document.getElementById("place_marker")
                //everytime you click map modal button is clicked
                modal.click();

                // accessing select tag in html
                var chng = document.getElementById("obstacle_type")
                // changing icon everytime there is a change
                var marker_icon = document.getElementById("image")
                chng.addEventListener("change", () => {
                    // console.log(chng.value)
                    marker_icon.setAttribute("src", `images/${chng.value}.png`)
                })

                // when clicking close button on modal
                var modal_close = document.getElementById("modal_close")
                modal_close.addEventListener("click", () => {
                    // console.log("close")
                    // some bug where if u dont touch form but cancel, it ties to prev form. my workaround is to add a value without user seeing before resetting
                    let temp = document.getElementById("obstacle_info")
                    temp.value = "a";
                    //resets modal form
                    document.getElementById("exampleModal").innerHTML = modal_form_class
                })

                // when clicking place marker on modal
                place_marker.addEventListener("click", () => {
                    var obstacle_type = document.getElementById("obstacle_type").value
                    var obstacle_info = document.getElementById("obstacle_info").value
                    var obstacle_details = document.getElementById("obstacle_details").value

                    // checking if obstacle type is valid
                    if (obstacle_info.length == 0) {
                        // failed
                        document.getElementById("exampleModal").innerHTML = modal_form_class
                        // will trigger error modal button
                        let modal_error = document.getElementById("modal_error_button");
                        modal_error.click();

                    } else {
                        // success
                        // create details to put in infow window
                        let danger_info = `
                        <div class="card" style="width: 18rem;">

                            <div class="card-header bg-dark-subtle" >
                                <h4>
                                    Obstacle Type: <span class="${obstacle_type}"><h4>${obstacle_info}</h4></span>
                                </h4>
                            </div>

                            <div class="card-body">
                                <p class="card-text">
                                    <span class="fw-bold">Details:</span> ${obstacle_details}
                                </p>

                                <p style="color:red;">
                                    Note: Double click marker to delete marker
                                </p>
                            </div>

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

                        // creating the identity by combining lat and lng 
                        let akey = mapsMouseEvent.latLng.toJSON().lat.toString() + mapsMouseEvent.latLng.toJSON().lng.toString()
                        let iden = akey.split('.').join('')
                        //adding marker to database
                        AddMarker(iden, mapsMouseEvent.latLng.toJSON(), danger_info, icons[obstacle_type].icon)

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
                            //function to remove marker from database
                            DeleteMarker(iden);
                        });

                        // reset the modal by changing inner HTML to initial modal, if not all markers tied to this form details
                        document.getElementById("exampleModal").innerHTML = modal_form_class
                    }

                })
            });

        } else {
            google.maps.event.clearListeners(map, 'click');
        }

    });
    return controlButton;
}

const firebaseConfig = {
    apiKey: "AIzaSyD_OxinfwWy9P_4PfUO0E34lgm8oogDlpE",
    authDomain: "rollwhere-aae1e.firebaseapp.com",
    databaseURL: "https://rollwhere-aae1e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rollwhere-aae1e",
    storageBucket: "rollwhere-aae1e.appspot.com",
    messagingSenderId: "315407102485",
    appId: "1:315407102485:web:d702b132f72212a7c5141c",
    measurementId: "G-LLXK2ZJXE6"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var markers = firebase.database().ref('markers')



//The following example demostrates how to add data

//The following writes the data
function AddMarker(iden, position, content, icon) {
    firebase.database().ref('markers/' + iden).set({
        position: position,
        content: content,
        icon: icon,
    }, function (error) {
        if (error) {
            console.log("err")
        } else {
            console.log("marker added")
        }
    });
}


function DeleteMarker(iden) {
    firebase.database().ref('markers/' + iden).remove()
        .then(function () {
            console.log("marker removed")
        })
        .catch(function (error) {
            console.log("remove err")
        });
}

// function gotData(data){
//     var marker = data.val()
//     var key = Object.keys(marker)
//     console.log(key)
//     console.log(marker[key].position)
//     CreateMarkers(marker[key].position,marker[key].content,marker[key].icon)
//     markers.off("value");
// }
// function errData(){
//     console.log('error')
// }

// function CreateMarkers(position,content,icon){

//     let marker = new google.maps.Marker({
//         position: position,
//         map,
//         content: content,
//         // title: danger_info,
//         icon: icon,

//     });
//     console.log(map)

//     // adding info window when u click that marker
//     marker.addListener("click", () => {
//         infoWindow.close();
//         // infoWindow.setContent(marker.getTitle());
//         infoWindow.setContent(marker.content);
//         infoWindow.open(marker.getMap(), marker);
//     });

//     // to delete marker double click marker
//     marker.addListener("dblclick", () => {
//         marker.setMap(null);
//         let akey = position.lat.toString() + position.lng.toString()
//         let iden = akey.split ('.').join ('')
//         DeleteMarker(iden);    
// })
// }





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
        this.setupPlaceChangedListener(originAutocomplete, "ORIG");
        this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
            destinationInput,
        );
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
        this.switchRoute()
        this.setUpSaveRouteListener()
        this.setUpLoadRouteListener()
        this.setUpShowSavedRoutes()  
        this.setUpSavedRoutesChanges()

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
        // localStorage.setItem("customRoute", JSON.stringify(routeData))

        //temporary code to mimic saving to database with localstorage
        if (!localStorage.getItem("savedRoute")) {
            let savedRoutes = []
            savedRoutes.push(routeData)
            console.log(savedRoutes, "first time init")
            localStorage.setItem("savedRoute", JSON.stringify(savedRoutes))
        }
        else {
            let savedRoutes = JSON.parse(localStorage.getItem("savedRoute"))
            console.log(savedRoutes, "> 1 time init")
            savedRoutes.push(routeData)
            localStorage.setItem("savedRoute", JSON.stringify(savedRoutes))
        }

        //if user drag routes
        // if (routeData.routes[0].legs[0].via_waypoints) {
        //     let waypoints = JSON.stringify(routeData.request.waypoints)
        //     localStorage.setItem("waypoints", waypoints)
        //     console.log(waypoints)
        // }
        console.log(routeData)
        console.log("saved your custom route")
    }
    
    //load saved routes
    loadRoute() {
        let savedRoute = localStorage.getItem("savedRoute")

        if (savedRoute) {
            let parsedSavedRoute = JSON.parse(savedRoute);
            console.log(parsedSavedRoute)


            //temporary code to mimic loading from database with localstorage

            if (parsedSavedRoute.request.waypoints) {
                // let parsedWaypoints = JSON.parse(localStorage.getItem("waypoints"))
                // console.log(parsedWaypoints)
                console.log(parsedSavedRoute.request.origin.placeId)

                this.directionsService.route(
                    {
                        origin: parsedSavedRoute.request.origin,
                        destination: parsedSavedRoute.request.destination,
                        travelMode: google.maps.DirectionsTravelMode.WALKING,
                        waypoints: parsedSavedRoute.request.waypoints //waypoints:parsedSavedRoute
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

    //initial load shows saved routes
    setUpShowSavedRoutes() {
        window.addEventListener("load", () => {
            let savedRoutesEl = document.getElementById("saved-routes")

            if (localStorage.getItem("savedRoute")) {
                let savedRoutes = JSON.parse(localStorage.getItem("savedRoute"))
                for (let i = 0; i < savedRoutes.length; i++) {
                    let li = document.createElement("li")
                    li.innerHTML = `Saved Route ${i + 1}`
                    
                    savedRoutesEl.appendChild(li)
                }
            }
        })
    }

    //any changes to saved routes
    setUpSavedRoutesChanges() {

        let savedRoutesEl = document.getElementById("saved-routes")
        savedRoutesEl.addEventListener("onchange", () => {
            if (localStorage.getItem("savedRoute")) {
                let savedRoutes = JSON.parse(localStorage.getItem("savedRoute"))
                for (let i = 0; i < savedRoutes.length; i++) {
                    let li = document.createElement("li")
                    li.innerHTML = `Saved Route ${i + 1}`

                    savedRoutesEl.appendChild(li)
                }
            }
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
