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
        document.getElementById('popular-movies').appendChild(div);
    });
}

// Fetch data from API
async function fetchData(endpoint) {
    const apiKey = 'fb36391bf7f0872322162fb66d71a790';
    const apiUrl = `https://api.themoviedb.org/3/`;
    const response = await fetch(`${apiUrl}${endpoint}?api_key=${apiKey}&language=en-US`);
    const data = await response.json();
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
            console.log('Shows Page');
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