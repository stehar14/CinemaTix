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

    if (firebaseUser.emailVerified)
  {
    console.log('Email is verified');
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