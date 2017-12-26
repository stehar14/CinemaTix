$('.button-collapse').sideNav({
      menuWidth: 300, // Default is 240
       // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );


$("#searchButton").on("click", function() {
  event.preventDefault();
  if ($("#searchPhrase").val().trim() === "") {
    alert("That's not a valid input!");
  } else{
    var phrase = $("#searchPhrase").val().trim();
    var movieURL= "https://api.themoviedb.org/3/search/movie?api_key=ac004416c837056eac779513d15becfb&language=en-US&query=" + phrase + "&page=1&include_adult=false"
    $.ajax({
      url: movieURL,
      method: "GET"
    }).done(function(response) {

        for (i=0; i<10; i++){
          console.log(response.results[i]);
          // Creating a div to hold the movie
          var movieDiv = $("<div class='movie' tmdb-id='" + response.results[i].id + "' youtube-search='" + response.results[i].title + " trailer'>");

          // Storing the rating data
          var title = response.results[i].title;

          // Creating an element to have the rating displayed
          var pOne = $("<p>").text(title);

          // Displaying the rating
          movieDiv.append(pOne);

          // Storing the release year
          var released = response.results[i].release_date;

          // Creating an element to hold the release year
          var pTwo = $("<p>").text("Released: " + released);

          // Displaying the release year
          movieDiv.append(pTwo);

          // Storing the plot
          var plot = response.results[i].overview;

          // Creating an element to hold the plot
          var pThree = $("<p>").text("Plot: " + plot);

          // Appending the plot
          movieDiv.append(pThree);

          // Retrieving the URL for the image
          var imgURL = "https://image.tmdb.org/t/p/w185/" + response.results[i].poster_path;

          // Creating an element to hold the image
          var image = $("<img>").attr("src", imgURL);
          image.attr("class", "poster");
          // Appending the image
          movieDiv.append(image);

          // Putting the entire movie above the previous movies
          $("#movies").append(movieDiv);
        }
    });
  }
});



    
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }