const API_KEY = '13d74b96235f1af19b629d1366c8d1a0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchData(endpoint, params = '') {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=fr-FR${params}`);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
    }
}

export async function getPopularMovies() {
    return await fetchData('/movie/popular');
}

export async function getPopularTVShows() {
    return await fetchData('/tv/popular');
}

export async function searchMulti(query) {
    return await fetchData('/search/multi', `&query=${encodeURIComponent(query)}`);
}

export async function getMovieDetails(movieId) {
    return await fetchData(`/movie/${movieId}`);
}

export async function getTVShowDetails(tvId) {
    return await fetchData(`/tv/${tvId}`);
}