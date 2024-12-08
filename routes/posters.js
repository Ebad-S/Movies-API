const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticateToken = require('../middlewares/authMiddleware');
const { getPoster, addPoster } = require('../controllers/postersController');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.get('/:imdbID', authenticateToken, getPoster);
router.post('/add/:imdbID', authenticateToken, upload.single('poster'), addPoster);

module.exports = router;