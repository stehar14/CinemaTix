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

var database = firebase.database();
var userId;

//Register button
$("#register").on("click", e =>
{
  e.preventDefault();
  e.stopPropagation();

  // Make reference variables for the email and password entered on the page
  const txtEmail = document.getElementById("email");
  const txtPassword = document.getElementById("password");
  const txtDisplay = document.getElementById("display-name");
  const display = txtDisplay.value;
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
        $("#modal2").show();
      })
    .then(e =>
  {
    var curser = auth.currentUser;
    curser.sendEmailVerification().then(e =>
    {
      // Email sent.
      console.log("Email sent.");
    }).catch(e =>
    {
      // An error happened.
      console.log(e.message);
      $("#error-msg").text(e.message);
      $("#modal2").show();
    });

    createUserData(curser.uid, display);

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
      $("#modal2").show();
   })
   .then(e =>
    {
      window.location.href="profile.html";
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

    if (firebaseUser.emailVerified)
  {
    console.log("email verified");
    getUsername();
    getJoinDate();
    getEmail();
  }
  else
  {
    $("#error-msg").text("Please verify your email address by clicking the link in the email we sent you!");
    $("#modal2").show();
    console.log('Email is not verified');
  }
  
  }
  else
  {
    console.log("Not logged in.");
    $("#register").show();
    $("#sign-in").show();
    $("#sign-out").hide();
  }
});

var userRef = database.ref("users/");

function createUserData(id, username)
{
	userRef.child(id).set(
	{
		username: username,
		movies: {},
		joinDate: moment().format("MM/DD/YYYY")
	});
}

function addMovie(movieId, callback)
{
	thisUserRef = database.ref("users/" + userId);
  var moviesRef = thisUserRef.child("movies");
  var newMoviesRef = moviesRef.push();
  id = newMoviesRef.name;
  newMoviesRef.set({
      id: movieId
  });

  console.log("Movie added");

  thisUserRef.once("value", function(snapshot)
  {
    console.log(snapshot.val().movies);
  });
}

function getMovieList()
{
  thisUserRef = database.ref("users/" + userId);
  thisUserRef.once("value", function(snapshot)
  {
    console.log(snapshot.val().movies);
  });
}

function getJoinDate()
{
	console.log(userId);
	thisUserRef = database.ref("users/" + userId);
	thisUserRef.once("value", function(snapshot)
	{
		console.log(snapshot.val().joinDate);
		$("#datejoined").html(snapshot.val().joinDate);
  });
}

function getUsername()
{
	thisUserRef = database.ref("users/" + userId);
  thisUserRef.once("value", function(snapshot)
  {
    console.log(snapshot.val().username);
    $("#usernamedisplay").html(snapshot.val().username);
  });
}

function getEmail()
{
	var email = firebase.auth().currentUser.email;
	console.log(email);
	$("#emailused").html(email);
}