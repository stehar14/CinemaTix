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
  var userId = firebase.auth().currentUser.uid;
  var rootRef = database.ref();
  var urlRef = rootRef.child("users/" + userId + "/movies");
  urlRef.on("child_added", function(snapshot) {
    
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
        var movieCard = $("<div class='col s12 m2'><div class='card'><div class='card-image'><img src='" + imgURL + "'><span class='card-title'>" + title + "</span><a class='delete btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>cancel</i></a></div><div class='card-content black'><p>Release: " + response.release_date + "</p><a class='ticket-link' href ='https://www.atomtickets.com/search?query=" + response.title + "'><img src='./assets/images/atomtix.jpg' height=40px width=40px>Tickets?</a></div></div></div>");

        // Putting the moiveListItem below the previous movies
        $("#profileinfo").append(movieCard);
      // If you click on the add button on a header, don't show/hide collapsible body
    
      });  
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