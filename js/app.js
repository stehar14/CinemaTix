// CinemaTix Site
// Project 1

// Global variable to store page value for query urls
var page;

// Global variable to hold response from ajax 
var res;

//hide discover results div (on discover page) on page load
$(document).ready(function() {
  $('#discover-results').hide();
});

// Global search function
function search() {
// If-else to make sure search-phrase isn't blank  
  if ($("#search-phrase").val().trim() === "") {
    $("#modal1").show();
  } else{
  // Update page text, show discover results div, show search next/prev, hide discover next/prev
    $(".page").text(page);
    $("#discover-results").show();
    $("#search-change").show();
    $("#discover-change").hide();
  // Removes any previous movie entries from the #movies div   
    $("#movies").empty();
  // Creates a query URL including user search phrase  
    var phrase = $("#search-phrase").val().trim();
    var movieURL= "https://api.themoviedb.org/3/search/movie?api_key=ac004416c837056eac779513d15becfb&language=en-US&query=" + phrase + "&page=" + page + "&include_adult=false"
  // AJAX call to get data from TMDB using query URL  
    $.ajax({
      url: movieURL,
      method: "GET"
    }).done(function(response) {
      res = response;
    // For loop to create collapsible elements (max 20 if the results page is full) and append to the #movies ul
      for (i=0; i<response.results.length; i++){
        console.log(response.results[i]);
      // Creating variables to hold response data
        var title = response.results[i].title;
        var released = response.results[i].release_date;
        var plot = response.results[i].overview;
      // Retrieving the URL for the image
        var imgURL = "https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path;
      // Creating a list item for collapsible list #movies
        var movieListItem = $("<li> <div class='collapsible-header movie center' tmdb-id='" + response.results[i].id + "' youtube-search='" + response.results[i].title + " official trailer'><span class='accordion-head-text'>" + response.results[i].title + "</span><a firebase-id='" + response.results[i].id + "' class='add-button btn-floating btn-large waves-effect waves-light red'><i class='material-icons center'>add</i></a></div><div class= 'collapsible-body'><img class='poster col s3 m3 l3' src='https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path + "'><p>" + response.results[i].overview + "</p> <p>Release date: " + response.results[i].release_date + "</p><a class='ticket-link' href ='https://www.atomtickets.com/search?query=" + response.results[i].title + "'><img src='./assets/images/atomtix.jpg' height=40px width=40px>See if this movie is playing near you!</a></div></li>" );
      // Putting the moiveListItem below the previous movies
        $("#movies").append(movieListItem);
      }
    
    // If you click on the add button on a header, don't show/hide collapsible body
    // Instead, add the firebase-id (holding the tmdb movie id) to realtime database
      $('.add-button').on('click', function(e) {
        e.stopPropagation();
        Materialize.toast('Added!', 2000);
        var movieNum = $(this).attr("firebase-id");
        addMovie(movieNum);
        console.log(movieNum);
      });
    });
  }
}

// Global discover function
function discover() {
// Update page text, show discover results div, show discover next/prev, hide search next/prev
  $(".page").text(page);
  $('#discover-results').show();
  $("#search-change").hide();
  $("#discover-change").show();
// Removes any previous movie entries from the #movies list   
  $("#movies").empty();
// Creates variable to hold user input for actor
  var actor = $("#actor").val().trim();
// If there is no actor input
  if (actor === "") {  
    var sort = $("#sort").val();
    var genre = $("#genre").val();
    var years = snapSlider.noUiSlider.get();
    var lowYear = years[0];
    var highYear = years[1];
    console.log(actor);
    console.log(sort);
    console.log(genre);
    console.log(lowYear);
    console.log(highYear);
  // Creates query URL based on user inputs
    var movieURL= "https://api.themoviedb.org/3/discover/movie?api_key=ac004416c837056eac779513d15becfb&original_language=en-US&sort_by=" + sort + "&release_date.gte=" + lowYear + "&release_date.lte=" + highYear + "&with_genres=" + genre + "&page=" + page + "&include_adult=false"
  // AJAX call to get data from TMDB using query URL  
    $.ajax({
      url: movieURL,
      method: "GET"
    }).done(function(response) {
      res=response;
      console.log(response);
      console.log(movieURL);
    // For loop to create collapsible elements (max 20 if the results page is full) and append to the #movies ul
      for (i=0; i<response.results.length; i++){
        console.log(response.results[i]);
      // Creating variables to hold response data
        var title = response.results[i].title;
        var released = response.results[i].release_date;
        var plot = response.results[i].overview;
      // Retrieving the URL for the image
        var imgURL = "https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path;
      // Creating a list item for collapsible list #movies
        var movieListItem = $("<li> <div class='collapsible-header movie center' tmdb-id='" + response.results[i].id + "' youtube-search='" + response.results[i].title + " official trailer'><span class='accordion-head-text'>" + response.results[i].title + "</span><a firebase-id='" + response.results[i].id + "' class='add-button btn-floating btn-large waves-effect waves-light red'><i class='material-icons center'>add</i></a></div><div class= 'collapsible-body'><img class='poster col s3 m3 l3' src='https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path + "'><p>" + response.results[i].overview + "</p> <p>Release date: " + response.results[i].release_date + "</p><a class='ticket-link' href ='https://www.atomtickets.com/search?query=" + response.results[i].title + "'><img src='./assets/images/atomtix.jpg' height=40px width=40px>See if this movie is playing near you!</a></div></li>" );

      // Putting the moiveListItem below the previous movies
        $("#movies").append(movieListItem);
      }
    // If you click on the add button on a header, don't show/hide collapsible body
    // Instead, add the firebase-id (holding the tmdb movie id) to realtime database
      $('.add-button').on('click', function(e) {
        e.stopPropagation();
        Materialize.toast('Added!', 2000);
        var movieNum = $(this).attr("firebase-id");
        addMovie(movieNum);
        console.log(movieNum);
      });
    });
  } else {
  // Else there is actor input
    var actorURL = "https://api.themoviedb.org/3/search/person?api_key=ac004416c837056eac779513d15becfb&query=" + actor;
    $.ajax({
      url: actorURL,
      method: "GET"
    }).done(function(response) {
      res=response;
      var actorId = response.results[0].id;  
      var sort = $("#sort").val();
      var genre = $("#genre").val();
      var years = snapSlider.noUiSlider.get();
      var lowYear = years[0];
      var highYear = years[1];
      console.log(actor);
      console.log(sort);
      console.log(genre);
      console.log(lowYear);
      console.log(highYear);
    // Creates query URL based on user inputs
      var movieURL= "https://api.themoviedb.org/3/discover/movie?api_key=ac004416c837056eac779513d15becfb&original_language=en-US&sort_by=" + sort + "&release_date.gte=" + lowYear + "&release_date.lte=" + highYear + "&with_genres=" + genre + "&with_cast=" + actorId + "&page=" + page + "&include_adult=false"
    // AJAX call to get data from TMDB using query URL  
      $.ajax({
        url: movieURL,
        method: "GET"
      }).done(function(response) {
        res=response;
        console.log(response);
        console.log(movieURL);
    // For loop to create collapsible elements (max 20 if the results page is full) and append to the #movies ul
        for (i=0; i<response.results.length; i++) {  
          console.log(response.results[i]);
        // Creating variables to hold response data
          var title = response.results[i].title;
          var released = response.results[i].release_date;
          var plot = response.results[i].overview;
        // Retrieving the URL for the image
          var imgURL = "https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path;
        // Creating a list item for collapsible list #movies
          var movieListItem = $("<li> <div class='collapsible-header movie center' tmdb-id='" + response.results[i].id + "' youtube-search='" + response.results[i].title + " official trailer'><span class='accordion-head-text'>" + response.results[i].title + "</span><a firebase-id='" + response.results[i].id + "' class='add-button btn-floating btn-large waves-effect waves-light red'><i class='material-icons center'>add</i></a></div><div class= 'collapsible-body'><img class='poster col s3 m3 l3' src='https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path + "'><p>" + response.results[i].overview + "</p> <p>Release date: " + response.results[i].release_date + "</p><a class='ticket-link' href ='https://www.atomtickets.com/search?query=" + response.results[i].title + "'><img src='./assets/images/atomtix.jpg' height=40px width=40px>See if this movie is playing near you!</a></div></li>" );
        // Putting the moiveListItem below the previous movies
          $("#movies").append(movieListItem);
        }
      // If you click on the add button on a header, don't show/hide collapsible body
      // Instead, add the firebase-id (holding the tmdb movie id) to realtime database
        $('.add-button').on('click', function(e) {
          e.stopPropagation();
          Materialize.toast('Added!', 2000);
          var movieNum = $(this).attr("firebase-id");
          addMovie(movieNum);
          console.log(movieNum);
        });
      });
    });
  }
}

// On click event listener for #search-button
$("#search-button").on("click", function() {
  // Prevents page reload
  event.preventDefault();
  page=1;
  search();
});

// On click event listener for previous button on search queries
$("#search-btn-prev").on("click", function() {
  // Prevents page reload
  event.preventDefault();
  if (page > 1) {
    page=page-1;
    search();
  }
});

// On click event listener for next button on search queries
$("#search-btn-next").on("click", function() {
  // Prevents page reload
  event.preventDefault();
  if (page < res.total_pages) {
    page=page+1;
    search();
  }
});

// On click event listener for #discover-submit 
$("#discover-submit").on("click", function() {
  // Prevents page reload
  event.preventDefault();
  page=1;
  discover();
});

// On click event listener for previous button on discover queries
$("#discover-btn-prev").on("click", function() {
  // Prevents page reload
  event.preventDefault();
  if (page > 1) {
    page=page-1;
    discover();
  }
});

// On click event listener for next button on discover queries
$("#discover-btn-next").on("click", function() {
  // Prevents page reload
  event.preventDefault();
  if (page < res.total_pages) {
    page=page+1;
    discover();
  }
});

// On click event listener for dynamically created .collapsible-headers in the #movies ul
$("#movies").on("click", ".collapsible-header", function(){
  // Removes any previously loaded youtube videos
  $(".dynamic-iframe").remove();
  // creates query URL including youtube-search attr of the .collapsible-header clicked
  var queryURL= "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDefinition=high&videoEmbeddable=true&key=AIzaSyBbYCvWi07zZ1Dt5MRqAevy4tqRBgtMxiE&q=" + $(this).attr("youtube-search");
  // AJAX call to get data from Youtube Data API using query URL
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    console.log(response.items[0].id.videoId);
    // Insert youtube video in .collapsible-body after .poster
    var youtubeVid = $("<iframe class='dynamic-iframe col s12 m9 l9' width='640' height='360' src='https://www.youtube.com/embed/" + response.items[0].id.videoId + "?enablejsapi=1' frameborder='0' style='border: solid 4px #37474F'></iframe>");
    $(youtubeVid).insertAfter(".poster");    
  });
});

// On click event listener for close button on modal pop ups
$("#modal-close").on("click", function () {
  $("#modal1").hide();
  $("#modal2").hide();
});

// On click event listener for #my-movies collapsible-header on profile page
// (getMovieList() function located in userData.js)
$("#my-movies").on("click", function() {
  $('#profile-info').empty();
  getMovieList();
});

// On click event listener for delete buttons on profile page
$('#profile-info').on('click', ".delete", function(e) {
  e.stopPropagation();
  Materialize.toast('Removed!', 2000);
  var firebaseMovieNum = $(this).attr("firebase-id");
  deleteMovie(firebaseMovieNum);
  console.log(firebaseMovieNum);
  setTimeout(function() {
    $('#profile-info').empty();
    getMovieList()} , 0);
});