// moviesController.js
const db = require('../utils/db');
const { handleDbError } = require('../utils/dbErrorHandler');

exports.searchMovies = async (req, res, next) => {
  const { title, year, page = 1 } = req.query;

  if (!title) {
    return res.status(400).json({
      error: true,
      message: 'Title parameter is required',
    });
  }

  if (year && !/^\d{4}$/.test(year)) {
    return res.status(400).json({
      error: true,
      message: 'Invalid year format. Format must be yyyy.',
    });
  }

  try {
    let query = db('basics')
      .select(
        'primaryTitle as Title',
        'startYear as Year',
        'tconst as imdbID',
        'titleType as Type'
      )
      .where('primaryTitle', 'like', `%${title}%`)
      .orderBy('tconst', 'asc')
      .limit(100)
      .offset((page - 1) * 100);

    if (year) {
      query = query.where('startYear', year);
    }

    const countQuery = db('basics')
      .where('primaryTitle', 'like', `%${title}%`);
    if (year) {
      countQuery.where('startYear', year);
    }
    const [{ count }] = await countQuery.count('* as count');

    const results = await query;

    const total = parseInt(count);
    const lastPage = Math.ceil(total / 100);

    res.json({
      data: results,
      pagination: {
        total,
        lastPage,
        perPage: 100,
        currentPage: parseInt(page),
        from: (page - 1) * 100,
        to: Math.min(page * 100, total)
      }
    });
  } catch (error) {
    next(handleDbError(error));
  }
};

exports.getMovieData = async (req, res, next) => {
    const { imdbID } = req.params;

    // Check for query parameters - they're not allowed
    if (Object.keys(req.query).length > 0) {
        return res.status(400).json({
            error: true,
            message: "Invalid query parameters. Query parameters are not permitted."
        });
    }

    try {
        const movieData = await db('basics')
            .select(
                'basics.primaryTitle as Title',
                'basics.startYear as Year',
                'basics.runtimeMinutes as Runtime',
                'basics.genres as Genre'
            )
            .leftJoin('crew', 'basics.tconst', 'crew.tconst')
            .leftJoin('ratings', 'basics.tconst', 'ratings.tconst')
            .where('basics.tconst', imdbID)
            .first();

        if (!movieData) {
            return res.status(404).json({
                error: true,
                message: "Movie not found"
            });
        }

        // Get director name
        let directorName = '';
        if (movieData.directors) {
            const directorResult = await db('names')
                .select('primaryName')
                .where('nconst', movieData.directors)
                .first();
            directorName = directorResult ? directorResult.primaryName : '';
        }

        // Get actors
        const actors = await db('principals')
            .join('names', 'principals.nconst', 'names.nconst')
            .select('names.primaryName')
            .where('principals.tconst', imdbID)
            .where('principals.category', 'actor')
            .limit(4);

        // Format the response
        const formattedData = {
            Title: movieData.Title,
            Year: movieData.Year,
            Runtime: `${movieData.Runtime} min`,
            Genre: movieData.Genre,
            Director: directorName,
            Writer: "", // Add writer logic if needed
            Actors: actors.map(a => a.primaryName).join(','),
            Ratings: [{
                Source: "Internet Movie Database",
                Value: `${movieData.averageRating || 'N/A'}/10`
            }]
        };

        res.json([formattedData]);

    } catch (error) {
        console.error('Database error:', error);
        next(handleDbError(error));
    }
};