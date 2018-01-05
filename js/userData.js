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
}

function getUsername()
{
	
}

