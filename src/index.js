const app = Vue.createApp({
    data() {
        return {
            activePage: {
                "homepage": true,
                "searchpage": false,
                "routepage": false
            },
            lastPageAccessed: null,
            lastSearchResponse: null,

            profilePics: [
                "images/profile/cat.png",
                "images/profile/cheetah.png",
                "images/profile/chicken.png",
                "images/profile/chipmunk.png",
                "images/profile/cow.png",
                "images/profile/dog.png",
                "images/profile/duck.png",
                "images/profile/elephant.png",
                "images/profile/giraffe.png",
                "images/profile/horse.png",
                "images/profile/kangaroo.png",
                "images/profile/monkey.png",
                "images/profile/panda.png",
                "images/profile/penguin.png",
                "images/profile/rabbit.png",
                "images/profile/raccoon.png",
                "images/profile/rat.png",
                "images/profile/sparrow.png",
                "images/profile/tiger.png",
                "images/profile/wolf.png"
            ],

            username: "mr.rollerman", // Will update this based on login
            usernameSettings: "",
            profilePicUrl: "images/profile/duck.png",
            profilePicSettings: "images/profile/duck.png",
            savedRoutes: [],
            savedRouteSelectedId: null,
            saveRouteFormError: "",
            saveRouteFormSuccess: "",

            originPlace: "",
            destinationPlace: "",

            currentRouteSteps: [],
            currentRouteSummary: "",
            currentRouteIndex: 0,
            currentRouteSaveName: "",
            stepsUpdatable: false,

            editMode: false,
            isTransit: false,
            transitSteps: [],
            currentTransitStepIndex: 0
        }
    },

    methods: {
        changeCanvas(page) {
            this.saveRouteFormError = "";
            this.saveRouteFormSuccess = "";
            for (const pageName in this.activePage) {
                if (this.activePage[pageName] === true) {
                    this.lastPageAccessed = pageName; // Update last page accessed to help with back button
                }

                if (pageName == page) {
                    this.activePage[pageName] = true;
                } else {
                    this.activePage[pageName] = false;
                }
            }
        },

        goBackCanvas() {
            this.changeCanvas(this.lastPageAccessed);
        },

        getLastPageAccessed() {
            return this.lastPageAccessed;
        },

        getLastSearchResponse() {
            return this.lastSearchResponse;
        },

        updateLastSearchResponse(response) {
            this.lastSearchResponse = response;
        },

        getRoute(id) {
            for (let route of this.savedRoutes) {
                if (route.id === id) {
                    return route.data;
                }
            }
            console.log("id of route not found!");
        },

        getRoutes() {
            return this.savedRoutes;
        },

        addRoute(routeName, routeData) {
            let ref = firebase.database().ref('users/' + user + "/routes")
            const newRoute = ref.push({
                name: routeName,
                routeData : routeData
            })
            console.log(newRoute.key)
            this.savedRoutes.push({ id: newRoute.key, name: routeName, data: routeData });
        },

        deleteRoute() {
            for (let i = 0; i < this.savedRoutes.length; i++) {
                if (this.savedRoutes[i].id === this.savedRouteSelectedId) {
                    firebase.database().ref('users/' + user + "/routes/" + this.savedRouteSelectedId).remove()
                    .then(function () {
                        console.log("route removed")
                    })
                    .catch(function (error) {
                        console.log("remove err")
                    });
                    this.savedRoutes.splice(i, 1);
                    this.savedRouteSelectedId = null;
                    return;
                }
            }
            console.log("id of route not found!");
        },

        clickLoadRoute() {
            document.getElementById("load-route").click();
        },

        getProfilePicUrl() {
            return this.profilePicUrl;
        },

        updateProfilePicSettings(url) {
            this.profilePicSettings = url;
        },

        updateProfile() {
            if (this.usernameSettings !== "") {
                this.username = this.usernameSettings;
                firebase.database().ref('users/'+ user).update({
                    username:this.usernameSettings
                })
            }

            if (this.profilePicUrl !== this.profilePicSettings) {
                this.profilePicUrl = this.profilePicSettings;
                firebase.database().ref('users/'+ user).update({
                    profilepic: this.profilePicSettings
                });
                document.getElementById("user-photo").src = this.profilePicSettings;
            }
        },

        logout() {
            //insert logout code here
        },

        cancelSettingsModal() {
            setTimeout(() => {
                this.usernameSettings = "";
                this.profilePicSettings = this.profilePicUrl;
            }, 200);
        },

        updateSavedRouteSelectedId(id) {
            this.savedRouteSelectedId = id;
        },

        updateSaveRouteFormError(msg) {
            this.saveRouteFormError = msg;
        },

        updateSaveRouteFormSuccess(msg) {
            this.saveRouteFormSuccess = msg;
        },

        updateOriginDest(origin, dest) {
            this.originPlace = origin;
            this.destinationPlace = dest;
        },

        updateCurrentRouteSteps(steps) {
            this.currentRouteSteps = steps;
        },

        updateCurrentRouteSummary(summary) {
            this.currentRouteSummary = summary;
        },

        getCurrentRouteIndex() {
            return this.currentRouteIndex;
        },

        updateCurrentRouteIndex(index) {
            this.currentRouteIndex = index;
        },

        updateUserName(username){
            this.username = username
        },

        updateProfilepic(profilepic){
            this.profilePicUrl = profilepic
            this.profilePicSettings = profilepic
        },

        getCurrentRouteSaveName() {
            return this.currentRouteSaveName;
        },

        updateCurrentRouteSaveName(name) {
            this.currentRouteSaveName = name;
        },

        getStepsUpdatable() {
            return this.stepsUpdatable;
        },

        updateStepsUpdatable(value) {
            this.stepsUpdatable = value;
        },

        getEditMode() {
            return this.editMode;
        },

        updateEditMode(bool) {
            this.editMode = bool;
        },

        getIsTransit() {
            return this.isTransit;
        },

        updateIsTransit(bool) {
            this.isTransit = bool;
        },

        getTransitSteps() {
            return this.transitSteps;
        },

        updateTransitSteps(steps) {
            this.transitSteps = steps;
        },

        getCurrentTransitStepIndex() {
            return this.currentTransitStepIndex;
        },

        updateCurrentTransitStepIndex(index) {
            this.currentTransitStepIndex = index;
        }
    }
});

const root = app.mount("#root");

// Initialize and add the map
let map;


// base template for modal form
var modal_form_class = `
<div id="modal-form" class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-10 fw-bold" id="exampleModalLabel">Place a marker</h1>
                        <button id="modal_close" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <form>
                        <div class="modal-body">

                            <div class="container-fluid">
                                <div class="row mt-2">

                                    <div class="col-6 d-flex justify-content-center">
                                        <img id="image" src="images/marker/barrier.png">
                                    </div>

                                    <div class="col-6">
                                        Select a marker type
                                        <select class="form-select" aria-label="Default select example"
                                            id="obstacle_type">
                                            <option value="barrier" selected>barrier</option>
                                            <option value="elevator">elevator</option>
                                            <option value="narrow">narrow</option>
                                            <option value="pothole">pothole</option>
                                            <option value="slope">slope</option>
                                            <option value="staircase">staircase</option>
                                        </select>
                                    </div>

                                </div>
                            </div>
                            <br>

                            Marker Name
                            <input type="text" class="form-control" id="obstacle_info" placeholder="Put marker name here">
                            <br>
                            Share any details about the marker
                            <textarea class="form-control" id="obstacle_details" placeholder="Put details here"></textarea>

                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn fw-bold text-light" id="place_marker"
                                data-bs-dismiss="modal" style="background-color: #3E837A;">Place Marker</button>
                        </div>
                    </form>
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
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DEFAULT,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        }
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
            markers.off('value', gotData)
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
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(BottomRightDiv);


    // this below is to use ryan photo as marker
    var userPhoto = document.createElement("img");
    userPhoto.src = root.getProfilePicUrl();
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
    controlButton.style.width = "20px";
    controlButton.style.height = "20px";
    controlButton.style.cursor = "pointer";
    controlButton.type = "checkbox";
    controlButton.id = "markerCheckbox"
    controlButton.style.verticalAlign = "middle"


    controlButton.addEventListener("click", () => {
        if (controlButton.checked === true) {
            // create info window
            let infoWindow = new google.maps.InfoWindow();

            // to add obstacle markers onto map
            map.addListener("click", (mapsMouseEvent) => {
                // more efficient way, creating a library of icons
                const icons = {
                    barrier: {
                        icon: "images/marker/barrier.png"
                    },
                    elevator: {
                        icon: "images/marker/elevator.png"
                    },
                    narrow: {
                        icon: "images/marker/narrow.png"
                    },
                    pothole: {
                        icon: "images/marker/pothole.png"
                    },
                    slope: {
                        icon: "images/marker/slope.png"
                    },
                    staircase: {
                        icon: "images/marker/staircase.png"
                    }
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
                    marker_icon.setAttribute("src", `images/marker/${chng.value}.png`)
                })

                // when clicking close button on modal
                var modal_close = document.getElementById("modal_close")
                modal_close.addEventListener("click", () => {
                    setTimeout(() => {
                        // some bug where if u dont touch form but cancel, it ties to prev form. my workaround is to add a value without user seeing before resetting
                        let temp = document.getElementById("obstacle_info")
                        temp.value = "a";
                        //resets modal form
                        document.getElementById("exampleModal").innerHTML = modal_form_class;
                    }, 200);
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
                                    <span class="${obstacle_type}"><h4>${obstacle_info}</h4></span>
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
                        controlButton.click();
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

// const auth = firebase.auth()



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
// checks if there is a user
var user = sessionStorage.getItem('user')
if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/v8/firebase.User
    // ...
  } else {
      location.href = "login.html"
    // No user is signed in.
  }

var routes = firebase.database().ref('users/'+ user + '/routes')
routes.on('value', gotDataRoutes)
function gotDataRoutes(data) {
    if (data.val()) {
        var route = data.val()
        var keys = Object.keys(route)
        let i = 0
        for (i = 0; i < keys.length; i++) {
            root.savedRoutes.push({ id: keys[i], name: route[keys[i]].name, data: route[keys[i]].routeData});
        }
        routes.off('value', gotDataRoutes)
    }
    else{
        routes.off('value', gotDataRoutes)
    }
}

if (user) {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/v8/firebase.User
  // ...
} else {
    location.href = "login.html"
  // No user is signed in.
}
const username = firebase.database().ref('users/'+ user +'/username')
username.on('value',gotDataUsername)

function gotDataUsername(data) {
    if (data.val()) {
        root.updateUserName(data.val())
        username.off('value', gotDataUsername)
    }
    else{
        username.off('value', gotDataUsername)
    }
}

const profilepic = firebase.database().ref('users/'+ user +'/profilepic')
profilepic.on('value',gotDataProfilepic)

function gotDataProfilepic(data){
    if (data.val()) {
        root.updateProfilepic(data.val())
        profilepic.off('value', gotDataProfilepic)
        document.getElementById("user-photo").src = root.getProfilePicUrl()
    }
    else{
        profilepic.off('value', gotDataProfilepic)
    }
}


//logout button listener
var logout = document.getElementById("logout-btn")
logout.addEventListener("click",()=>{
    sessionStorage.clear()
    location.href = "login.html"
  })


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
        this.switchRoute();
        this.setUpSaveRouteListener();
        this.setUpLoadRouteListener();
        this.setupBackBtnListener();
        this.setUpEditRoute();
        this.directionsRenderer.addListener("directions_changed", () => {
            let stepsUpdatable = root.getStepsUpdatable();
            root.updateStepsUpdatable(!stepsUpdatable);
            if (root.getStepsUpdatable() === true) {
                let routeData = this.directionsRenderer.getDirections();
                if (routeData.request.waypoints) {
                    this.directionsService.route(
                        {
                            origin: routeData.request.origin,
                            destination: routeData.request.destination,
                            travelMode: routeData.request.travelMode,
                            waypoints: routeData.request.waypoints
                        },
                        (response, status) => {
                            if (status === "OK") {
                                root.updateCurrentRouteSteps(response.routes[0].legs[0].steps);
                                root.updateCurrentRouteIndex(0);
                                root.updateOriginDest(response.routes[0].legs[0].start_address, response.routes[0].legs[0].end_address);
                                root.updateCurrentRouteSummary(response.routes[0].summary);
                                this.directionsRenderer.setDirections(response);
                            } else {
                                window.alert("Directions request failed due to " + status);
                            }
                        });
                } else {
                    root.updateCurrentRouteSteps(routeData.routes[0].legs[0].steps);
                    root.updateCurrentRouteIndex(0);
                    root.updateOriginDest(routeData.routes[0].legs[0].start_address, routeData.routes[0].legs[0].end_address);
                    root.updateCurrentRouteSummary(routeData.routes[0].summary);
                    this.directionsRenderer.setDirections(routeData);
                }
            }
        })
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
        let routeDataCopy = JSON.parse(JSON.stringify(routeData)); // Create a copy so we don't edit the original response.
        let routeName = root.getCurrentRouteSaveName();
        if (routeName === "") {
            routeName = document.getElementById("save-route-name-input").getAttribute("placeholder");
        }

        if (!root.getEditMode()) {
            let selectedRouteIndex = root.getCurrentRouteIndex();
            routeDataCopy.routes = [routeDataCopy.routes[selectedRouteIndex]]; // Ensure routes array only has the selected route
        }

        let savedRoutes = root.getRoutes();
        for (let route of savedRoutes) {
            if (route.name === routeName) {
                root.updateSaveRouteFormError("You already have a route with the same name!");
                root.updateSaveRouteFormSuccess("");
                return;
            }
        }
        root.updateSaveRouteFormSuccess("Saved!");
        root.updateSaveRouteFormError("");

        root.addRoute(routeName, routeDataCopy);
        root.updateCurrentRouteSaveName("");
    }

    //load saved routes
    loadRoute() {
        let savedRoute = root.getRoute(root.savedRouteSelectedId);
        if (Array.isArray(savedRoute)) { // If the savedRoute is an array means it is a transit-based route
            // root.updateCurrentRouteSteps(response.routes[0].legs[0].steps);
            // root.updateCurrentRouteIndex(0);
            // root.updateOriginDest(response.routes[0].legs[0].start_address, response.routes[0].legs[0].end_address);
            // root.updateCurrentRouteSummary(response.routes[0].summary);
            root.updateEditMode(true);
            root.updateIsTransit(false);
            root.updateCurrentTransitStepIndex(0);
            let index = root.getCurrentTransitStepIndex();
            root.updateTransitSteps(savedRoute);
            if (savedRoute[index].waypoints) {
                //display the route with waypoints
                this.displayRouteTravelMode(savedRoute, index, savedRoute[index].waypoints);
            } else {
                this.displayRouteTravelMode(savedRoute, index);
            }
            root.changeCanvas("routepage");
        } else {
            root.updateEditMode(false);
            if (savedRoute.request.waypoints) {
                this.directionsService.route(
                    {
                        origin: savedRoute.request.origin,
                        destination: savedRoute.request.destination,
                        travelMode: savedRoute.request.travelMode,
                        waypoints: savedRoute.request.waypoints
                    },
                    (response, status) => {
                        if (status === "OK") {
                            if (savedRoute.request.travelMode === "TRANSIT") {
                                root.updateIsTransit(true);
                            } else {
                                root.updateIsTransit(false);
                            }

                            root.updateCurrentRouteSteps(response.routes[0].legs[0].steps);
                            root.updateCurrentRouteIndex(0);
                            root.updateOriginDest(response.routes[0].legs[0].start_address, response.routes[0].legs[0].end_address);
                            root.updateCurrentRouteSummary(response.routes[0].summary);
                            root.changeCanvas("routepage");
                            this.directionsRenderer.setDirections(response);
                        } else {
                            window.alert("Directions request failed due to " + status);
                        }
                    });
            } else {
                if (savedRoute.request.travelMode === "TRANSIT") {
                    root.updateIsTransit(true);
                } else {
                    root.updateIsTransit(false);
                }

                root.updateCurrentRouteSteps(savedRoute.routes[0].legs[0].steps);
                root.updateCurrentRouteIndex(0);
                root.updateOriginDest(savedRoute.routes[0].legs[0].start_address, savedRoute.routes[0].legs[0].end_address);
                root.updateCurrentRouteSummary(savedRoute.routes[0].summary);
                root.changeCanvas("routepage");
                this.directionsRenderer.setDirections(savedRoute);
            }
        }
    }

    //handle the save routes
    setUpSaveRouteListener() {
        let saveRouteBtn = document.getElementById("save-route");

        saveRouteBtn.addEventListener("click", () => {
            if (root.getEditMode()) {
                let routeData = this.directionsRenderer.getDirections();
                let steps = root.getTransitSteps();
                let index = root.getCurrentTransitStepIndex();

                if (routeData.routes[0].legs[0].via_waypoints.length !== 0) {
                    //set new property called waypoints into current step with the waypoints of current directionsResult object
                    steps[index].waypoints = routeData.routes[0].legs[0].via_waypoints;
                    root.updateTransitSteps(steps);
                }

                this.saveRoute(steps);
            } else {
                let routeData = this.directionsRenderer.getDirections();
                this.saveRoute(routeData);
            }
        });
    }

    //handle the load routes
    setUpLoadRouteListener() {
        let loadRouteBtn = document.getElementById("load-route");

        loadRouteBtn.addEventListener("click", () => {
            this.loadRoute();
        });
    }

    // This allows us to access directionsRenderer when pressing back button to reload previous response because response may have changed when dragging routes to modify them
    setupBackBtnListener() {
        let backBtn = document.getElementById("back-btn");

        backBtn.addEventListener("click", () => {
            if (root.getLastPageAccessed() === "searchpage") {
                let lastSearchResponse = root.getLastSearchResponse();
                if (lastSearchResponse.request.travelMode === "TRANSIT") {
                    root.updateIsTransit(true);
                } else {
                    root.updateIsTransit(false);
                }

                root.updateEditMode(false);
                this.directionsRenderer.setDirections(lastSearchResponse);
            }
            root.goBackCanvas();
        })
    }

    //helper function to help display each step onto the map to edit
    displayRouteTravelMode(steps, index, waypoints = "none") {
        root.updateEditMode(true);
        if (steps[index].travel_mode == "WALKING") {
            if (waypoints != "none") {
                let newStructureWaypoints = []
                for (let waypoint of waypoints) {
                    newStructureWaypoints.push({ location: waypoint, stopover: false })
                }
                this.directionsService.route(
                    {
                        origin: steps[index].start_location,
                        destination: steps[index].end_location,
                        travelMode: google.maps.TravelMode.WALKING,
                        waypoints: newStructureWaypoints
                    },
                    (result) => {
                        this.directionsRenderer.setDirections(result)
                    })
            } else {
                this.directionsService.route(
                    {
                        origin: steps[index].start_location,
                        destination: steps[index].end_location,
                        travelMode: google.maps.TravelMode.WALKING
                    },
                    (result) => { this.directionsRenderer.setDirections(result) }
                )
            }
        } else {
            this.directionsService.route(
                {
                    origin: steps[index].start_location,
                    destination: steps[index].end_location,
                    travelMode: google.maps.TravelMode.TRANSIT
                },
                (result) => {
                    this.directionsRenderer.setDirections(result)
                }
            )
        }
    }

    //edit the routes 
    setUpEditRoute() {
        let editRouteBtn = document.getElementById("edit-route");
        let nextRouteBtn = document.getElementById("next-route");
        let prevRouteBtn = document.getElementById("prev-route");

        //when user press this edit route button (only will appear for transit), the first step (usually walkable path) will be active
        editRouteBtn.addEventListener("click", () => {
            if (this.directionsRenderer.getDirections()) {
                root.updateIsTransit(false);
                root.updateCurrentTransitStepIndex(0);
                let index = root.getCurrentTransitStepIndex();
                let selectedRouteIndex = root.getCurrentRouteIndex();
                let currentRoute = this.directionsRenderer.getDirections().routes[selectedRouteIndex];

                let steps = currentRoute.legs[0].steps;
                root.updateTransitSteps(steps);
                //calls a directionService and directionRenderer and display onto map
                this.displayRouteTravelMode(steps, index);
            }
        })

        //this button will only appear when user press edit route button, this will also show the next step
        nextRouteBtn.addEventListener("click", () => {
            let index = root.getCurrentTransitStepIndex();
            let prevStep = this.directionsRenderer.getDirections();

            let steps = root.getTransitSteps();

            //saving the waypoints from the current step 
            if (prevStep.routes[0].legs[0].via_waypoints.length !== 0) {
                //set new property called waypoints into current step with the waypoints of current directionsResult object
                steps[index].waypoints = prevStep.routes[0].legs[0].via_waypoints;
                root.updateTransitSteps(steps);
            }

            //go into next step 
            root.updateCurrentTransitStepIndex(root.getCurrentTransitStepIndex() + 1);
            index = root.getCurrentTransitStepIndex();

            //if there are waypoints in current step
            if (steps[index].waypoints) {
                //display the route with waypoints
                this.displayRouteTravelMode(steps, index, steps[index].waypoints);
            } else {
                this.displayRouteTravelMode(steps, index);
            }
        })

        prevRouteBtn.addEventListener("click", () => {
            let prevStep = this.directionsRenderer.getDirections();
            let steps = root.getTransitSteps();
            let index = root.getCurrentTransitStepIndex();

            if (prevStep.routes[0].legs[0].via_waypoints.length !== 0) {
                steps[index].waypoints = prevStep.routes[0].legs[0].via_waypoints;
                root.updateTransitSteps(steps);
            }

            root.updateCurrentTransitStepIndex(root.getCurrentTransitStepIndex() - 1);
            index = root.getCurrentTransitStepIndex();

            if (steps[index].waypoints) {
                this.displayRouteTravelMode(steps, index, steps[index].waypoints);
            } else {
                this.displayRouteTravelMode(steps, index);
            }
        })
    }

    route() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }

        root.changeCanvas("searchpage");
        document.getElementById("navbar-button").click(); // Force open offcanvas after searching

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
                    if (this.travelMode === "TRANSIT") {
                        root.updateIsTransit(true);
                    } else {
                        root.updateIsTransit(false);
                    }

                    root.updateEditMode(false);
                    root.updateLastSearchResponse(response);
                    root.updateOriginDest(response.routes[0].legs[0].start_address, response.routes[0].legs[0].end_address);

                    let alternateRouteListEl = document.getElementById("alternate-routes-list");
                    alternateRouteListEl.innerHTML = "";

                    for (let i = 0; i < response.routes.length; i++) {
                        let li = document.createElement("li");
                        let routeName = "";
                        if (response.routes[i].summary === "") {
                            let stepModes = [];
                            for (let step of response.routes[i].legs[0].steps) {
                                if (step.travel_mode === "TRANSIT") {
                                    stepModes.push(step.instructions.split(" ")[0]);
                                }
                            }
                            routeName = stepModes.join(" -> ");
                            if (routeName === "") {
                                routeName = "No Transits";
                            }
                        } else {
                            routeName = response.routes[i].summary;
                        }

                        li.innerHTML = `
                        <div class="card card border-success alternate-routes-li-item mb-3">
                            <div class="card-header card-title" id="card-header">
                                <h5>
                                    Route ${i + 1}: ${routeName}
                                </h5>
                            </div>
                            <div class="p-1">
                                <p class="card-text">
                                    <span class="fw-bold">Distance:</span>
                                     ${response.routes[i].legs[0].distance.text}
                                <br>
                                <span class="fw-bold">Duration:</span>
                                    ${response.routes[i].legs[0].duration.text}
                                </p>
                            </div>
                        </div>
                        `;
                        li.addEventListener("click", () => {
                            this.switchRoute(i);
                            root.updateCurrentRouteSteps(response.routes[i].legs[0].steps);
                            root.updateCurrentRouteSummary(response.routes[i].summary);
                            root.updateCurrentRouteIndex(i);
                            root.changeCanvas("routepage");
                        });
                        alternateRouteListEl.appendChild(li);
                    }

                    console.log("route()", response);
                    me.directionsRenderer.setDirections(response);
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            },
        );
    }
}

window.initMap = initMap;
