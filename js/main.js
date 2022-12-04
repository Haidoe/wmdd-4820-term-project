// alert("connected");
// ****************************************************************************
// ****************************************************************************
//
//          Final Exam
//
//  Instructions:
//      Make sure to always provide meaningful feedback to the user
//          (not just the name or number, talk to the user as if they are
//           standing in front of you)
//
//      Preload the Movie Object with Data from TMDB (1 page of trending movies)
//
//      Section 1 should allow the user to add as many movies and showtimes as they want
//
//      Section 2 should allow the user to scroll through movies and showtimes
//              let the user click the Pick Movie button to populate Section 3
//
//      Section 3 should allow the user to buy a ticket for a movie/showtime
//          Section 3 requires:
//              you to get the movie from the user
//              you to get the showtime from the user
//              you to get the number of tickets from the user
//              use the movie and showtime to get the ticket price
//                  (remember that diff showtimes may have diff costs)
//                  (also, for this exercise, there are no discount seats)
//
//              calculate the total price as:
// ****************************************************************************
//  ===============> (ticket price * number of tickets * 1.15 (to add tax))
// ****************************************************************************
//              Display this amount back to the user in a meaningful way
//
// ****************************************************************************

// ****************************************************************************
// ****************************************************************************
// ****************************************************************************

// ****************************************************************************
//      Start of Program
// ****************************************************************************
// ****************************************************************************
//          Variable Declarations
// ****************************************************************************
// ****************************************************************************
//  Full-Scope Variables
let movieObjectsArray = [];
let customMovieArray = [];
//Combination of movieObjectsArray && customMovieArray
let allMovieArray = [];

let currentIndex = 0;
let moviePrice = 0;

//Usually this is something you want to put in .env
const baseUrl = "https://api.themoviedb.org/3";
const apiKey = "8d97d616c053720f58594b66af247d0c";
const trendingMoviesUrl = `${baseUrl}/trending/movie/day?api_key=${apiKey}`;

const prices = {
  "11am": 4.99,
  "2pm": 6.99,
  "5pm": 8.99,
  "8pm": 11.99,
};

// ****************************************************************************
//  Pull Movies from API and Load the Movie Array
//
//  Show times are base on rating:
//      movies with ratings of at least 4 will be shown at 11am
//      movies with ratings of at least 6 will be shown at 11am and 2pm
//      movies with ratings of at least 7 will be shown at 11am, 2pm, and 5pm
//      movies with ratings above 8 will be shown at 11am, 2pm, 5pm, and 8pm
//
//  Prices:
//      11am - $4.99
//      2pm - $6.99
//      5pm - $8.99
//      8pm - $11.99
//
//  Grades:
//      option 1: Load movie and times via a switch statement with fall-through - max 100% for section
//      option 2: Load movie and times via a switch statement - max 90% for section
//      option 3: Load movie and times via an if-statement - max 80% for section
//
//      For example:
//          if you get 8/10 on the section and you implemented option 1 you get 8 marks
//          if you get 8/10 on the section and you implemented option 2 you get 7 marks
//          if you get 8/10 on the section and you implemented option 3 you get 6.5 marks
//
//      Sample Object:
//          const movieObj = {
//              movieName: title,
//              showtime: showtime,
//              price: price
//          }
//
// ****************************************************************************
// Populate the Movie Table - 10 marks
getMovies(trendingMoviesUrl);

async function getMovies(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log("MOVIES FROM TMDB API", data.results);

    if (data.results.length) {
      //Removing 3 and below
      let movies = data.results.filter(
        (item) => Math.floor(item.vote_average) > 3
      );

      //Switch Fallthrough
      for (const movie of movies) {
        const rating = movie.vote_average;

        switch (Boolean(rating)) {
          case rating >= 8: {
            addMovieWithSchedule(movie, "8pm");
          }

          case rating >= 7: {
            addMovieWithSchedule(movie, "5pm");
          }

          case rating >= 6: {
            addMovieWithSchedule(movie, "2pm");
          }

          case rating >= 4: {
            addMovieWithSchedule(movie, "11am");
          }
        }
      }

      mergeMovieArrays();
    }
  } catch (error) {
    console.log(error);
  }
}

// ****************************************************************************
// ****************************************************************************
//  Function Variables

function addMovieWithSchedule({ title }, showtime) {
  movieObjectsArray.push({
    title,
    showtime,
    price: prices[showtime],
  });
}

//Merge the Movies from TMDB and Custom Movies From User Input
function mergeMovieArrays(params) {
  allMovieArray = [...customMovieArray, ...movieObjectsArray];
  console.log("UPDATED MOVIE ARRAY", allMovieArray);
}

//Concatinating am/pm
function convertIntegerToTime(showtime) {
  if (showtime === 0) {
    return "12am";
  } else if (showtime > 0 && showtime < 12) {
    return `${showtime}am`;
  } else if (showtime === 12) {
    return "12pm";
  } else {
    return `${showtime - 12}pm`;
  }
}

//display error message
function showErrorMessage(node, message, output) {
  node.style.borderColor = "red";
  output.innerHTML = message;
  output.style.color = "red";
}

const resetInputBorder = (node) => () => {
  node.style.borderColor = "";
};

// ****************************************************************************
// ****************************************************************************
//      Event Listeners
// ****************************************************************************
// ****************************************************************************
//  Load Movie Array - 10 marks

//Resets Border Color
c1Movie.addEventListener("input", resetInputBorder(c1Movie));
c1Time.addEventListener("input", resetInputBorder(c1Time));
c1Price.addEventListener("input", resetInputBorder(c1Price));

addMovie.addEventListener("click", () => {
  //Reset Style
  c1Movie.style.borderColor = "";
  c1Time.style.borderColor = "";
  c1Price.style.borderColor = "";
  c1Output.innerHTML = "";
  c1Output.style.color = "#000";

  try {
    //Removing the excess whitespaces.
    const title = c1Movie.value.trim();

    //Check if the movie title has a value
    if (!title) {
      throw {
        node: c1Movie,
        message: "Movie title is required.",
      };
    }

    let showtime = c1Time.value;

    //Check if the showtimes has a value
    if (!showtime) {
      throw {
        node: c1Time,
        message: "Showtime is required.",
      };
    }

    //Convert to Number
    showtime = Number(c1Time.value);

    //Must be a valid number
    if (isNaN(showtime)) {
      throw {
        node: c1Time,
        message: "Showtime is not a valid number.",
      };
    }

    //Must be a whole number
    if (showtime % 1 !== 0) {
      throw {
        node: c1Time,
        message: "Showtime must be a whole number ranging 0-23.",
      };
    }

    //Must only accepts 0 - 23
    if (Math.floor(showtime) < 0 || Math.floor(showtime) >= 24) {
      throw {
        node: c1Time,
        message: "Showtime must be a whole number ranging 0-23.",
      };
    }

    let price = c1Price.value;

    //Check if the price has a value
    if (!price.length) {
      throw {
        node: c1Price,
        message: "Price is required.",
      };
    }

    //Must be a number
    price = Number(c1Price.value);

    //Must be a valid number
    if (isNaN(price)) {
      throw {
        node: c1Price,
        message: "Price must be a valid number.",
      };
    }

    //Must be greater than 0
    if (price <= 0) {
      throw {
        node: c1Price,
        message: "Price must be greater than 0",
      };
    }

    const customMovie = {
      title,
      showtime: convertIntegerToTime(showtime),
      price,
    };

    //Add to customMovieArray
    customMovieArray.push(customMovie);

    //Combine the movieObjectsArray
    mergeMovieArrays();

    //Success message
    c1Output.innerHTML = `Movie added. There are ${allMovieArray.length} movies available.`;

    //Reset the inputs
    c1Movie.value = "";
    c1Price.value = "";
    c1Time.value = "";
  } catch (error) {
    showErrorMessage(error.node, error.message, c1Output);
  }
});

// ****************************************************************************
// ****************************************************************************
//  View the Available Movies - 5 marks
load.addEventListener("click", () => {});

// ****************************************************************************
// ****************************************************************************
//  Navigate through the Showtimes - 5 marks each (so 15 marks for this section)
next.addEventListener("click", () => {});

prev.addEventListener("click", () => {});

pickMovie.addEventListener("click", () => {});

// ****************************************************************************
// ****************************************************************************
//  Calculate Ticket Price - 10 marks
calcTotal.addEventListener("click", () => {});
