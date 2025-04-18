const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export function displayPopularMovies(movies) {
    const container = document.getElementById('popular-movies');
    if (!container || !movies) return;

    container.innerHTML = movies.results.slice(0, 12).map(movie => `
        <div class="media-card" data-id="${movie.id}" data-type="movie">
            <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'assets/no-image.jpg'}" alt="${movie.title}">
            <div class="media-info">
                <h3>${movie.title}</h3>
                <p>${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
            </div>
        </div>
    `).join('');
}

export function displayPopularTVShows(tvShows) {
    const container = document.getElementById('popular-tvshows');
    if (!container || !tvShows) return;

    container.innerHTML = tvShows.results.slice(0, 12).map(show => `
        <div class="media-card" data-id="${show.id}" data-type="tv">
            <img src="${show.poster_path ? IMAGE_BASE_URL + show.poster_path : 'assets/no-image.jpg'}" alt="${show.name}">
            <div class="media-info">
                <h3>${show.name}</h3>
                <p>${show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A'}</p>
            </div>
        </div>
    `).join('');
}