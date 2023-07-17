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

// I'm fully aware you should not store keys and secrets in code or github, but this is just for training purpouse, and it's a public API with no critical data
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

// Display Mobie Details
async function getMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  const movie = await fetchAPIData(`movie/${movieId}?language=en-US`);
  console.log(movie);

  // Overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="details-top">
      <div>
      ${
        movie.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class='card-img-top' alt='${movie.title}' />
        `
          : `
          <img src='images/no-image.jpg' class='card-img-top' alt='${movie.title}' />
        `
      }
      </div>
      <div>
        <h2>${movie.title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average}
        </p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>
        ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${
          movie.homepage
        }" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> ${numberWithCommas(
          movie.budget
        )}</li>
        <li><span class="text-secondary">Revenue:</span> ${numberWithCommas(
          movie.revenue
        )}</li>
        <li><span class="text-secondary">Runtime:</span> ${
          movie.runtime
        } minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
      ${movie.production_companies
        .map((company) => `<span>${company.name}, </span>`)
        .join('')}
      </div>
    </div>
  `;
  document.getElementById('movie-details').appendChild(div);
}

// Display backdrop on details page
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.getElementById('movie-details').appendChild(overlayDiv);
  } else {
    document.getElementById('show-details').appendChild(overlayDiv);
  }
}

// Fetch Data from API
async function fetchAPIData(endpoint) {
  showSpinner();
  const response = await fetch(`${API_URL}${endpoint}?language=en-US`, options);
  const data = await response.json();
  hideSpinner();
  return data;
}

// Toggle Spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
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

// Add comas to numbers
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
      getMovieDetails();
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
