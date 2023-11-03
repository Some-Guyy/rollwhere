// https://firebase.google.com/docs/reference/js/auth.md#createuserwithemailandpassword
//https://firebase.google.com/docs/auth/web/password-auth

const app = Vue.createApp({
    data() { 
        return {
            logo: "images/RollWhere_Logo.jpg",
            logo_width: "40%",
            logo_height: "40%",

            welcome_size: '200px',
            error_msg: "",
        }
    }
})

const vm = app.mount('#app')

//map section below
// Initialize and add the map
let map;

async function initMap() {

    //create map
    const { Map } = await google.maps.importLibrary("maps");
    // below to create standard markers
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");


    // The map, centered at Singpore on load
    var map = new Map(document.getElementById("map"), {
        zoom: 11,
        center: { lat: 1.3521, lng: 103.8198 },
        mapId: "5100c9e4073b9a44",
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT}
    });

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
            });
        },
    );
}

window.initMap = initMap;

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
const auth = firebase.auth()
//login user
Login.addEventListener("click",()=>{
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
    sessionStorage.setItem('user',user.uid)
    location.href = 'index.html'
    alert("login successful go to index.html")

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    let errorMessage2 = "Wrong Password or Wrong Email"
    vm.error_msg = errorMessage2
    // alert(errorMessage2)
  });

})

ResetPassword.addEventListener("click",()=>{
  let email = document.getElementById('EmailReset').value
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      // Password reset email sent!
      // ..
      alert("Password reset email sent!")
      location.href = 'login.html'

    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage)
      // ..
    });

  })




