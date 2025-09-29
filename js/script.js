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


function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
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
            console.log('Movie Details Page');
            break;
        case '/tv-details.html':
            console.log('TV Details Page');
            break;
        case '/search.html':
            console.log('Search Page');
            break;
    }
    highlightActiveLink();
    displayPopularMovies();
}

document.addEventListener('DOMContentLoaded', init);