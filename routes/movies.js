const express = require('express');
const router = express.Router();
const { searchMovies, getMovieData } = require('../controllers/moviesController');

router.get('/search', searchMovies);
router.get('/data/:imdbID', getMovieData);

module.exports = router;
