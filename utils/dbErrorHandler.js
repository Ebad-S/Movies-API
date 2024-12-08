class DatabaseError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'DatabaseError';
        this.originalError = originalError;
        this.status = 500;
    }
}

function handleDbError(error) {
    console.error('Database Error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
        return new DatabaseError('Duplicate entry found', error);
    }
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
        return new DatabaseError('Database table not found', error);
    }

    if (error.code === 'ECONNREFUSED') {
        return new DatabaseError('Database connection failed', error);
    }

    return new DatabaseError('Database operation failed', error);
}

module.exports = { DatabaseError, handleDbError }; 