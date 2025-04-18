const API_KEY = '13d74b96235f1af19b629d1366c8d1a0'; // Remplacez par votre clé API TMDB
const BASE_URL = 'https://api.themoviedb.org/3'; // URL de base de l'API
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // URL de base pour les images des films et séries

let pageMovies = 1;
let pageTvShows = 1;

// Récupérer les films populaires
const fetchPopularMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${pageMovies}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Erreur lors de la récupération des films populaires:", error);
    }
};

// Récupérer les séries populaires
const fetchPopularTvShows = async () => {
    try {
        const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${pageTvShows}`);
        const data = await response.json();
        displayTvShows(data.results);
    } catch (error) {
        console.error("Erreur lors de la récupération des séries populaires:", error);
    }
};

// Affichage des films
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

        // Ajouter un gestionnaire d'événements pour le bouton de détail
        movieItem.querySelector('.detail-btn').addEventListener('click', () => showDetails(movie.id, 'movie'));
        // Ajouter un gestionnaire d'événements pour le bouton des favoris
        movieItem.querySelector('.fav-btn').addEventListener('click', () => addToFavorites(movie));
    });
};

// Affichage des séries
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

        // Ajouter un gestionnaire d'événements pour le bouton de détail
        tvShowItem.querySelector('.detail-btn').addEventListener('click', () => showDetails(tvShow.id, 'tv'));
        // Ajouter un gestionnaire d'événements pour le bouton des favoris
        tvShowItem.querySelector('.fav-btn').addEventListener('click', () => addToFavorites(tvShow));
    });
};

// Fonction pour afficher les détails d'un film ou d'une série
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
    
    // Afficher les commentaires précédents (si disponibles)
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
    
    // Afficher la section de détail
    detailSection.style.display = 'block';
    
    // Gestion du formulaire de commentaire
    const submitComment = document.getElementById('submitComment');
    submitComment.addEventListener('click', () => {
        const commentText = document.getElementById('commentInput').value;
        if (commentText) {
            addComment(id, type, commentText);
            document.getElementById('commentInput').value = '';
            showDetails(id, type); // Actualiser la section des commentaires
        }
    });
};

// Ajouter un commentaire dans le localStorage
const addComment = (itemId, type, text) => {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push({
        itemId,
        type,
        user: 'Utilisateur',  // En fonction de votre système d'authentification, vous pouvez récupérer le nom de l'utilisateur
        text
    });
    localStorage.setItem('comments', JSON.stringify(comments));
};

// Ajouter un film ou une série aux favoris
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

        // Ajouter un gestionnaire d'événements pour le bouton de suppression des favoris
        favoriteItem.querySelector('.remove-btn').addEventListener('click', () => removeFromFavorites(item.id));
    });
};

// Supprimer un film ou une série des favoris
const removeFromFavorites = (id) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites(favorites);
};

// Charger les films populaires et séries au démarrage
fetchPopularMovies();
fetchPopularTvShows();
