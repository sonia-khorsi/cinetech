const API_KEY = '13d74b96235f1af19b629d1366c8d1a0'; 
const BASE_URL = 'https://api.themoviedb.org/3'; 
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let pageMovies = 1;
let pageTvShows = 1;


const fetchPopularMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${pageMovies}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Erreur lors de la récupération des films populaires:", error);
    }
};


const fetchPopularTvShows = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${pageTvShows}`);
        const data = await response.json();
        displayTvShows(data.results);
    } catch (error) {
        console.error("Erreur lors de la récupération des séries populaires:", error);
    }
};


const displayMovies = (movies) => {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
            <button class="detail-btn" data-id="${movie.id}">Voir les détails</button>
            <button class="fav-btn" data-id="${movie.id}">Ajouter aux favoris</button>
        `;
        moviesList.appendChild(movieItem);

        
        movieItem.querySelector('.detail-btn').addEventListener('click', () => showDetails(movie.id, 'movie'));
      
        movieItem.querySelector('.fav-btn').addEventListener('click', () => addToFavorites(movie));
    });
};


const displayTvShows = (tvShows) => {
    const tvShowsList = document.getElementById('tvShowsList');
    tvShowsList.innerHTML = '';
    tvShows.forEach(tvShow => {
        const tvShowItem = document.createElement('div');
        tvShowItem.classList.add('tvshow-item');
        tvShowItem.innerHTML = `
            <img src="${IMAGE_BASE_URL}${tvShow.poster_path}" alt="${tvShow.name}">
            <h3>${tvShow.name}</h3>
            <p>${tvShow.first_air_date}</p>
            <button class="detail-btn" data-id="${tvShow.id}">Voir les détails</button>
            <button class="fav-btn" data-id="${tvShow.id}">Ajouter aux favoris</button>
        `;
        tvShowsList.appendChild(tvShowItem);

        
        tvShowItem.querySelector('.detail-btn').addEventListener('click', () => showDetails(tvShow.id, 'tv'));
       
        tvShowItem.querySelector('.fav-btn').addEventListener('click', () => addToFavorites(tvShow));
    });
};


const showDetails = async (id, type) => {
    const detailSection = document.getElementById('detailSection');
    const detailContent = document.getElementById('detailContent');
    const commentsList = document.getElementById('commentsList');
    
    let response;
    let data;
    if (type === 'movie') {
        response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    } else if (type === 'tv') {
        response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
    }
    
    data = await response.json();
    detailContent.innerHTML = `
        <img src="${IMAGE_BASE_URL}${data.poster_path}" alt="${data.title || data.name}">
        <div>
            <h2>${data.title || data.name}</h2>
            <p><strong>Résumé:</strong> ${data.overview}</p>
            <p><strong>Date de sortie:</strong> ${data.release_date || data.first_air_date}</p>
            <p><strong>Genre(s):</strong> ${data.genres.map(genre => genre.name).join(', ')}</p>
            <p><strong>Durée:</strong> ${data.runtime || 'N/A'} minutes</p>
            <p><strong>Réalisateur:</strong> ${data.directors ? data.directors[0].name : 'Inconnu'}</p>
        </div>
    `;
    
    
    commentsList.innerHTML = '';
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    const filteredComments = comments.filter(comment => comment.itemId === id && comment.type === type);
    filteredComments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.innerHTML = `
            <p><strong>${comment.user}</strong>: ${comment.text}</p>
        `;
        commentsList.appendChild(commentItem);
    });
    
 
    detailSection.style.display = 'block';
    
   
    const submitComment = document.getElementById('submitComment');
    submitComment.addEventListener('click', () => {
        const commentText = document.getElementById('commentInput').value;
        if (commentText) {
            addComment(id, type, commentText);
            document.getElementById('commentInput').value = '';
            showDetails(id, type); 
        }
    });
};


const addComment = (itemId, type, text) => {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push({
        itemId,
        type,
        user: 'Utilisateur',  
    });
    localStorage.setItem('comments', JSON.stringify(comments));
};


const addToFavorites = (item) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.find(fav => fav.id === item.id)) {
        favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites(favorites);
    }
};

// Récupérer les favoris
const displayFavorites = (favorites) => {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    favorites.forEach(item => {
        const favoriteItem = document.createElement('div');
        favoriteItem.classList.add('favorite-item');
        favoriteItem.innerHTML = `
            <img src="${IMAGE_BASE_URL}${item.poster_path}" alt="${item.title || item.name}">
            <h3>${item.title || item.name}</h3>
            <p>${item.release_date || item.first_air_date}</p>
            <button class="remove-btn" data-id="${item.id}">Retirer des favoris</button>
        `;
        favoritesList.appendChild(favoriteItem);

       
        favoriteItem.querySelector('.remove-btn').addEventListener('click', () => removeFromFavorites(item.id));
    });
};


const removeFromFavorites = (id) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites(favorites);
};


fetchPopularMovies();
fetchPopularTvShows();
