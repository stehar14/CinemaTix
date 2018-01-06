// CinemaTix Site
// Project 1

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

// Global variables to hold reference to firebase database and user id
var database = firebase.database();
var userId;

// On click function for the register button on reg page
$("#register").on("click", e =>
{
  e.preventDefault();
  e.stopPropagation();
// Make reference variables for the display name, email, and password entered on the page
  const txtEmail = document.getElementById("email");
  const txtPassword = document.getElementById("password");
  const txtDisplay = document.getElementById("display-name");
  const display = txtDisplay.value;
  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();
  console.log("Email: " + email);
  console.log("Password: " + password);
// Create promise to create new user using email and password
  const promise = auth.createUserWithEmailAndPassword(email, password);
  promise
  // Display error in modal    
    .catch(e => 
      {
        console.log(e.message)
        $("#error-msg").text(e.message);
        $("#modal2").show();
      })
  // Then send email to verify the users email address
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
  // Create uid for user set to display value 
    createUserData(curser.uid, display);

   });
});

// On click event listener for the Sign-in Button on reg page
$("#sign-in").on("click", e =>
{
  // Don't reload the page
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
// Create promise to sign user in using the email and password entered
  const promise = auth.signInWithEmailAndPassword(email, password);
  promise
  .catch(e => 
   {
  // Display error in modal
     console.log(e.message);
     $("#error-msg").text(e.message);
      $("#modal2").show();
   })
  // After successful sign in, redirect to profile page
   .then(e =>
    {
      window.location.href="profile.html";
    });
});

// On click event listener for Sign-out button on reg page
$("#sign-out").on("click", e =>
{
    firebase.auth().signOut();
});

// Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser =>
{
// If a user is logged in, hide register and sign in buttons, display sign out
  if(firebaseUser)
  {
    console.log(firebaseUser);
    $("#register").hide();
    $("#sign-in").hide();
    $("#sign-out").show();

    userId = firebase.auth().currentUser.uid;
  //If the signed in user verified their email, allow them to access their profile features
    if (firebaseUser.emailVerified)
  {
    console.log("email verified");
    getUsername();
    getJoinDate();
    getEmail();
  }
  else
  {
  // Otherwise show modal indicating their email needs to be verified
    $("#error-msg").text("Please verify your email address by clicking the link in the email we sent you!");
    $("#modal2").show();
    console.log('Email is not verified');
  }
  
  }
// Otherwise, show register and sign in button, and hide sign out button  
  else
  {
    console.log("Not logged in.");
    $("#register").show();
    $("#sign-in").show();
    $("#sign-out").hide();
  }
});

//Variable to hold database reference to users subset
var userRef = database.ref("users/");

// Function to initialize user data upon registration
function createUserData(id, username)
{
	userRef.child(id).set(
	{
		username: username,
		movies: {},
		joinDate: moment().format("MM/DD/YYYY")
	});
}

// Function to add movie from discover page to your movie list
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

function deleteMovie(movieId) {
  thisUserRef = database.ref("users/" + userId);
  var moviesRef = thisUserRef.child("movies");
  moviesRef.orderByChild('id').equalTo(movieId)
    .once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        //remove each child
        moviesRef.child(childSnapshot.key).remove();
    });
});
}

// Function to populate My Movies list on Profile page
function getMovieList()
{
// Set reference point in database  
  var userId = firebase.auth().currentUser.uid;
  var rootRef = database.ref();
  var urlRef = rootRef.child("users/" + userId + "/movies");
  urlRef.on("child_added", function(snapshot) {
  // Creates query URL using the movie ids stored in the realtime database for the current user
  // Runs an ajax call to obtain movie info from TMDB and creates a Materialize card for each movie
  // and appends it to the profile-info span in the collapsible-body on the profile page
    cardURL= "https://api.themoviedb.org/3/movie/" + snapshot.val().id + "?api_key=ac004416c837056eac779513d15becfb&language=en-US";
    $.ajax({
      url: cardURL,
      method: "GET"
    }).done(function(response) {
      res=response;
      console.log(response);
      console.log(cardURL);
    // Creating variables to hold response data
      var title = response.title;
      var released = response.release_date;
      var plot = response.overview;
    // Retrieving the URL for the image
      var imgURL = "https://image.tmdb.org/t/p/w185/" + response.poster_path;
    // Creating a list item for collapsible list #movies
      var movieCard = $("<div class='col s12 m2 my-card'><div class='card'><div class='card-image'><img src='" + imgURL + "'><span class='card-title'>" + title + "</span><a firebase-id='" + response.id + "' class='delete btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>cancel</i></a></div><div class='card-content black'><p>Release: " + response.release_date + "</p><a class='ticket-link' href ='https://www.atomtickets.com/search?query=" + response.title + "'><img src='./assets/images/atomtix.jpg' height=40px width=40px>Tickets?</a></div></div></div>");
    // Putting the moiveCard behind the previous movies
      $("#profile-info").append(movieCard);
    });  
  });
}

// Function to display join date on profile page
function getJoinDate()
{
	console.log(userId);
	thisUserRef = database.ref("users/" + userId);
	thisUserRef.once("value", function(snapshot)
	{
		console.log(snapshot.val().joinDate);
		$("#date-joined").html("Member since: " + snapshot.val().joinDate);
  });
}

// Function to display username on profile page
function getUsername()
{
	thisUserRef = database.ref("users/" + userId);
  thisUserRef.once("value", function(snapshot)
  {
    console.log(snapshot.val().username);
    $("#username-display").html(snapshot.val().username);
    $("#display-name").attr("placeholder", snapshot.val().username);
  });
}

// Function to display email on profile page
function getEmail()
{
	var email = firebase.auth().currentUser.email;
	console.log(email);
	$("#email-used").html(email);
  $("#email").attr("placeholder", email);
}