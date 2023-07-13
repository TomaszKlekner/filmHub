const global = {
  currentPage: window.location.pathname,
};

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmIwZjUxZjdkOWI2MDAyMGVhYTlkZmY1Y2VhMjc5MSIsInN1YiI6IjY0YTY4MmFiMmI1MzFkMDBhZWRjZmY4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BeBbcbUfQFTG0YZN0_XBn5pyDZub82v5ytqIV9vUhKw',
  },
};

const API_KEY = 'ffb0f51f7d9b60020eaa9dff5cea2791';
const API_URL = 'https://api.themoviedb.org/3/';

// Fetch popular movies
async function getPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}]">
        ${
          movie.poster_path
            ? `
          <img
          src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}" />
        `
            : `
        <img
        src="../images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}" />
        `
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>
    `;

    document.getElementById('popular-movies').appendChild(div);
  });
}

// Fetch Data from API
async function fetchAPIData(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}?language=en-US`, options);
  const data = await response.json();
  return data;
}

// Active Link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      getPopularMovies();
      break;
    case '/shows.html':
      console.log('Shows');
      break;
    case '/movie-details.html':
      console.log('Movie Details');
      break;
    case '/tv-details.html':
      console.log('TV Details');
      break;
    case '/search.html':
      console.log('Search');
      break;
    default:
      console.log('Home');
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
