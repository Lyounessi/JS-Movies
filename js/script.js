const global = {
    currentPage: window.location.pathname
}

//highlight active link
function highlightActiveLink () {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
    if (link.getAttribute('href') === global.currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }       
});
}

async function displayPopularMovies() {
    const { results } = await fetchData('movie/popular');
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">    
            ${
                movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">` : '<img src="images/no-image.jpg" class="card-img-top" alt="No Image Available">'
            }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">Release Date: ${movie.release_date}</p>
            </div>
        `;
        document.querySelector('#popular-movies').appendChild(div);
    });
}

async function displayPopularShows() {
    const { results } = await fetchData('tv/popular');
    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">    
            ${
                show.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}">` : '<img src="images/no-image.jpg" class="card-img-top" alt="No Image Available">'
            }
            </a>
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">First Air Date: ${show.first_air_date}</p>
            </div>
        `;
        document.querySelector('#popular-shows').appendChild(div);
        console.log(document.querySelector('#popular-shows'));
    });
}

async function displayMoviesDetails() {
    const movieId = window.location.search.split('=')[1];
    const movie = await fetchData(`movie/${movieId}`);
    //overlay background
    displayBackgroundImage('movie', movie.backdrop_path);
    //details

    const div = document.createElement('div');
    div.innerHTML = `
    <div class="details-top">
          <div>
            <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="Movie Title"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
                ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${addCommasNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> ${addCommasNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map(company => company.name).join(', ')}</div>
        </div> `;
    document.querySelector('#movie-details').appendChild(div);
}

async function displayShowDetails() {
    console.log(document.querySelector('#show-details'));

    const showId = window.location.search.split('=')[1];
    const show = await fetchData(`tv/${showId}`);
    //overlay background
    displayBackgroundImage('tv', show.backdrop_path);
    //details
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="details-top">
          <div>
            <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="Show Name"
            />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
                ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status} </li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map(company => company.name).join(', ')}</div>
        </div>`;
    document.querySelector('#show-details').appendChild(div);
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}


function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backgroundPath})`;
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
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else if (type === 'tv') {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

// Fetch data from API
async function fetchData(endpoint) {
    const apiKey = 'fb36391bf7f0872322162fb66d71a790';
    const apiUrl = `https://api.themoviedb.org/3/`;
    showSpinner();
    const response = await fetch(`${apiUrl}${endpoint}?api_key=${apiKey}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}


function  addCommasNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//init app
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            console.log('Home Page');
            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            displayMoviesDetails();
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            console.log('Search Page');
            break;
    }
    highlightActiveLink();
    displayPopularMovies();
}

document.addEventListener('DOMContentLoaded', init);