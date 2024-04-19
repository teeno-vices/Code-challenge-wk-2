// Your code here
let allMovies = [];

function getMovies() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:3000/films", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      allMovies = result;
      ListMovies(result);
    })
    .catch((error) => console.error(error));
}

function ListMovies(movies) {
  const movieList = document.getElementById("films");
 
  let html = "";
  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i];
    html += `<li class="film item" onclick="clickedMovie(${i})">${movie.title}</li>`;
  }
  movieList.innerHTML = html;
}

getMovies();

function clickedMovie(i) {
  let poster = document.getElementById("poster");
  let clickedMovie = allMovies[i];
  poster.src = clickedMovie.poster;
  poster.alt = clickedMovie.title;
  movieinfo(clickedMovie.id);
}

function movieinfo(id) {
  const movieTitle = document.getElementById("title");
  const runtime = document.getElementById("runtime");
  const info = document.getElementById("film-info");
  const showtime = document.getElementById("showtime");
  const ticket = document.getElementById("ticket-num");
  const btn = document.getElementById("buy-ticket");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`http://localhost:3000/films/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      movieTitle.innerText = result.title;
      runtime.innerText = `${result.runtime} minutes`;
      info.innerText = result.description;
      showtime.innerText = result.showtime;
      ticket.innerText = `Remaining tickets: ${result.capacity - result.tickets_sold}`;
      btn.addEventListener("click", function () {
        console.log("Buy ticket")
        console.log(result);
        let remainingTickets=result.capacity -result.tickets_sold;
        if (remainingTickets >0){
          makeASale(result);}
        else {ticket.innerText = "Sold Out !!!"};

      });
    })
    .catch((error) => console.error(error));
}
function makeASale(movie){
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw = JSON.stringify({
    "id": "1",
    "title": movie.title,
    "runtime": movie.runtime,
    "capacity": movie.capacity,
    "showtime": movie.showtime,
    "tickets_sold": movie.tickets_sold +1,
    "description": movie.description,
    "poster": movie.poster,
  });

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(`http://localhost:3000/films/${movie.id}`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
      console.log(result);
      movieinfo(movie.id);
  })
  .catch((error) => console.error(error));
}
