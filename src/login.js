// https://firebase.google.com/docs/reference/js/auth.md#createuserwithemailandpassword
//https://firebase.google.com/docs/auth/web/password-auth

const app = Vue.createApp({
    data() { 
        return {
            logo: "images/RollWhere_Logo.jpg",
            logo_width: "40%",
            logo_height: "40%",

            welcome_size: '200px',
            
        }
    }
})

const vm = app.mount('#app')


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
    location.href = 'index.html'
    alert("login successful go to index.html")
    sessionStorage.setItem('user',user.uid)

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage)
  });

})




