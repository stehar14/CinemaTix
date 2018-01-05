// Initialize Firebase
var config =
{
    apiKey: "AIzaSyAxBKyA_lhLfSxekoM6VRMciqin1BWPf78",
    authDomain: "cinematixdatabase.firebaseapp.com",
    databaseURL: "https://cinematixdatabase.firebaseio.com",
    projectId: "cinematixdatabase",
    storageBucket: "cinematixdatabase.appspot.com",
    messagingSenderId: "500516738721"
};
firebase.initializeApp(config);

var userId;

//Register button
$("#register").on("click", e =>
{
  e.preventDefault();
  e.stopPropagation();

  // Make reference variables for the email and password entered on the page
  const txtEmail = document.getElementById("email");
  const txtPassword = document.getElementById("password");

  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();

  console.log("Email: " + email);
  console.log("Password: " + password);

  const promise = auth.createUserWithEmailAndPassword(email, password);
  promise
    .catch(e => 
      {
        console.log(e.message)
        $("#error-msg").text(e.message);
     	$("#error-msg").show();
      })
    .then(e =>
	{
	  var user = auth.currentUser;

	  createUserData(user.uid, "username");
   });
});

// Sign-in Button
$("#sign-in").on("click", e =>
{
  e.preventDefault();
  e.stopPropagation();

  // Make reference variables for the email and password entered on the page
  const txtEmail = document.getElementById("email");
  const txtPassword = document.getElementById("password");

  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();

  console.log("Email: " + email);
  console.log("Password: " + password);

  const promise = auth.signInWithEmailAndPassword(email, password);
  promise
  .catch(e => 
   {
     console.log(e.message);
     $("#error-msg").text(e.message);
     $("#error-msg").show();
   });
});

// Sign-out button
$("#sign-out").on("click", e =>
{
  	firebase.auth().signOut();
});

// Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser =>
{
  if(firebaseUser)
  {
    console.log(firebaseUser);
    $("#register").hide();
    $("#sign-in").hide();
    $("#sign-out").show();

    userId = firebase.auth().currentUser.uid;
  }
  else
  {
    console.log("Not logged in.");
    $("#register").show();
    $("#sign-in").show();
    $("#sign-out").hide();
  }
});

var database = firebase.database();
var userRef = database.ref().child("users/");

function createUserData(id, username)
{
	userRef.child(id).set(
	{
		username: username,
		movies: [],
		joinDate: moment().format("MM/DD/YYYY")
	});
}

function addMovie(movieId)
{
	
}

function getMovieList()
{
	
}

function getJoinDate()
{

}

function getUsername()
{
	var username;
	database.ref("users/" + userId).once("child_added", function(snapshot)
	{
		username = snapshot.val().username;
	});
}

console.log("Username: " + getUsername());
