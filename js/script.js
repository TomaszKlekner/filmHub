const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
  },
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

// Fetch TV shows
async function getTVShows() {
  const { results } = await fetchAPIData('tv/top_rated');

  console.log(results);

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="show-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `
          <img
          src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
          class="card-img-top"
          alt="${show.name}" />
        `
            : `
        <img
        src="../images/no-image.jpg"
        class="card-img-top"
        alt="${show.name}" />
        `
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Aired: ${show.first_air_date
            .split('-')
            .reverse()
            .join('.')}</small>
        </p>
      </div>
    `;

    document.getElementById('popular-shows').appendChild(div);
  });
}

// Display Movie Details
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
          ${movie.vote_average} / 10
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

// Display TV Show Details
async function getTVShowDetails() {
  const showId = window.location.search.split('=')[1];
  const show = await fetchAPIData(`tv/${showId}?language=en-US`);
  console.log(show);

  // Overlay for background image
  displayBackgroundImage('show', show.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="details-top">
      <div>
      ${
        show.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500/${show.poster_path}" class='card-img-top' alt='${show.name}' />
        `
          : `
          <img src='images/no-image.jpg' class='card-img-top' alt='${show.name}' />
        `
      }
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average} / 10
        </p>
        <p class="text-muted">First Air Date: ${show.first_air_date
          .split('-')
          .reverse()
          .join('.')}</p>
        <p>
        ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${
          show.homepage
        }" target="_blank" class="btn">Visit show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number of episodes:</span>
        ${show.number_of_episodes}</li>
        <li><span class="text-secondary">Number of seasons:</span>
        ${show.number_of_seasons}</li>
        <li><span class="text-secondary">Last Episode to Air:</span>
        ${show.last_episode_to_air.name}
        </li>
        <li><span class="text-secondary">Status:</span> ${show.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
      ${show.production_companies
        .map((company) => `<span>${company.name}, </span>`)
        .join('')}
      </div>
    </div>
  `;
  document.getElementById('show-details').appendChild(div);
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
// Search Movies/Shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    // @todo - mare a request and display results
  } else {
    showAlert('Enter a search tearm');
  }
}

// Display the slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData(`movie/now_playing`, options);

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${result.id}">
        <img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="${result.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${result.vote_average} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);
  });

  initSwiper();
}

// Init Swiper
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    autoplay: false,
    direction: 'horizontal',
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
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
// Custom Alert function
function showAlert(message, className) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
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
      displaySlider();
      getPopularMovies();
      break;
    case '/shows.html':
      console.log('Shows');
      getTVShows();
      break;
    case '/movie-details.html':
      getMovieDetails();
      break;
    case '/show-details.html':
      getTVShowDetails();
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
