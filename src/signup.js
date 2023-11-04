// https://firebase.google.com/docs/reference/js/auth.md#createuserwithemailandpassword
//https://firebase.google.com/docs/auth/web/password-auth


const app = Vue.createApp({
  data() { 
      return {
          logo: "images/RollWhere_Logo.jpg",
          logo_width: "60%",
          logo_height: "60%",

          captions: {
            "wheelchair2": "We understand",
            "wheelchair3": "Because we care",
            "wheelchair5": "Let us guide you",
          },

          error_msg: "",
          success_msg: "",
          countdown: 3
          
      }
  },
  methods: {

    find_caption(wheelchair) {
      this.caption = this.captions[wheelchair];
    },

    startRedirectCountDown() {
      //if the countdown is not 0, it will call itself 
      if (this.countdown !== -1){
        //recursive function!!!
        setTimeout(()=> {
          this.success_msg = `Account created successfully! Redirecting you in ${this.countdown}`
          this.countdown--
          this.startRedirectCountDown()
        }, 1000)
      }
      else {
        location.href='login.html'
      }
    }
  }, 
})

const signUp = app.mount('#signUp')

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

function AddUser(userId, username, email) {
  firebase.database().ref('users/' + userId).set({
  username: username,
  email: email
  
  }, function(error) {
  if (error) {
      console.log(error)
  } else {
    signUp.startRedirectCountDown()
  }
  });
}

//add user to database after signup
SignUp.addEventListener('click',()=>{
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  var username = document.getElementById('username').value
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    AddUser(user.uid,username,email)
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    let errMsg = errorMessage;
    signUp.error_msg = errMsg;
    // ..
  });



})





