// postersController.js
const fs = require('fs');
const path = require('path');

exports.getPoster = async (req, res) => {
    const { imdbID } = req.params;
    const userEmail = req.user.email; // From JWT token

    // Check for query parameters - they're not allowed
    if (Object.keys(req.query).length > 0) {
        return res.status(400).json({
            error: true,
            message: "Invalid query parameters. Query parameters are not permitted."
        });
    }

    const posterPath = path.join(__dirname, '../res/posters', `${imdbID}_${userEmail}.png`);

    try {
        if (!fs.existsSync(posterPath)) {
            return res.status(500).json({
                error: true,
                message: `ENOENT: no such file or directory, open '${posterPath}'`
            });
        }

        res.setHeader('Content-Type', 'image/png');
        fs.createReadStream(posterPath).pipe(res);
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

exports.addPoster = async (req, res) => {
    const { imdbID } = req.params;
    const userEmail = req.user.email; // From JWT token

    // Check for query parameters - they're not allowed
    if (Object.keys(req.query).length > 0) {
        return res.status(400).json({
            error: true,
            message: "Invalid query parameters. Query parameters are not permitted."
        });
    }

    // Ensure the posters directory exists
    const postersDir = path.join(__dirname, '../res/posters');
    if (!fs.existsSync(postersDir)) {
        fs.mkdirSync(postersDir, { recursive: true });
    }

    const posterPath = path.join(postersDir, `${imdbID}_${userEmail}.png`);

    try {
        // Save the uploaded file
        const fileBuffer = req.file.buffer;
        fs.writeFileSync(posterPath, fileBuffer);

        res.json({
            error: false,
            message: "Poster Uploaded Successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};