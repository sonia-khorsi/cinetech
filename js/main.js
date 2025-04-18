import { getPopularMovies, getPopularTVShows } from './api.js';
import { displayPopularMovies, displayPopularTVShows } from './ui.js';

async function loadPopularMovies() {
    const movies = await getPopularMovies();
    if (movies) displayPopularMovies(movies);
}

async function loadPopularTVShows() {
    const tvShows = await getPopularTVShows();
    if (tvShows) displayPopularTVShows(tvShows);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPopularMovies();
    loadPopularTVShows();
});