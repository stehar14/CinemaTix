


$("#searchButton").on("click", function() {
  event.preventDefault();
  if ($("#searchPhrase").val().trim() === "") {
    alert("That's not a valid input!");
  } else{
    $("#movies").empty();
    var phrase = $("#searchPhrase").val().trim();
    var movieURL= "https://api.themoviedb.org/3/search/movie?api_key=ac004416c837056eac779513d15becfb&language=en-US&query=" + phrase + "&page=1&include_adult=false"
    $.ajax({
      url: movieURL,
      method: "GET"
    }).done(function(response) {

        for (i=0; i<10; i++){
          console.log(response.results[i]);
          // Creating a div to hold the movie
          var title = response.results[i].title;
          var released = response.results[i].release_date;
          var plot = response.results[i].overview;
          // Retrieving the URL for the image
          var imgURL = "https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path;

          
          var movieListItem = $("<li> <div class='collapsible-header movie center' tmdb-id='" + response.results[i].id + "' youtube-search='" + response.results[i].title + " official trailer'><span class='accordion-head-text'>" + response.results[i].title + "</span><a class='add-button btn-floating btn-large waves-effect waves-light red'><i class='material-icons center'>add</i></a></div><div class= 'collapsible-body'><img class='poster' src='https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path + "'><p>" + response.results[i].overview + "</p> <p>Release date: " + response.results[i].release_date + "</p></div></li>" );

          /* Storing the rating data
          var title = response.results[i].title;

          // Creating an element to have the rating displayed
          var pOne = $("<p>").text(title);

          // Displaying the rating
          movieListItem.append(pOne);

          // Storing the release year
          var released = response.results[i].release_date;

          // Creating an element to hold the release year
          var pTwo = $("<p>").text("Released: " + released);

          // Displaying the release year
          movieListItem.append(pTwo);

          // Storing the plot
          var plot = response.results[i].overview;

          // Creating an element to hold the plot
          var pThree = $("<p>").text("Plot: " + plot);

          // Appending the plot
          movieListItem.append(pThree);

          // Retrieving the URL for the image
          var imgURL = "https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path;

          // Creating an element to hold the image
          var image = $("<img>").attr("src", imgURL);
          image.attr("class", "poster");
          // Appending the image
          movieListItem.append(image);*/

          // Putting the entire movie above the previous movies
          $("#movies").append(movieListItem);
        }
        $('.add-button').on('click', function(e) {
          e.stopPropagation();
          Materialize.toast('test', 2000);
        });
    });
  }
});

$("#movies").on("click", ".collapsible-header", function(){
  $(".existing-iframe-example").remove();
  var queryURL= "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDefinition=high&videoEmbeddable=true&key=AIzaSyBbYCvWi07zZ1Dt5MRqAevy4tqRBgtMxiE&q=" + $(this).attr("youtube-search");
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    console.log(response.items[0].id.videoId);

    var youtubeVid = $("<iframe class='existing-iframe-example' width='640' height='360' src='https://www.youtube.com/embed/" + response.items[0].id.videoId + "?enablejsapi=1' frameborder='0' style='border: solid 4px #37474F'></iframe>");
    $(youtubeVid).insertAfter(".poster");
    
  });
});

