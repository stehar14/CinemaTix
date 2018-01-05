var database = firebase.database();
var userRef = database.ref().child("/users");
var thisUser;

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
	var userId = firebase.auth().currentUser.uid;
	
}

function getMovieList()
{
	var userId = firebase.auth().currentUser.uid;
}

function getJoinDate()
{
	var userId = firebase.auth().currentUser.uid;
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
	var userId = firebase.auth().currentUser.uid;
	console.log(userId);
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

