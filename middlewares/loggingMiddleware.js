const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Define log file paths
const accessLogPath = path.join(logsDir, 'access.log');
const errorLogPath = path.join(logsDir, 'error.log');
const debugLogPath = path.join(logsDir, 'debug.log');

// Create write streams
const accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' });
const errorLogStream = fs.createWriteStream(errorLogPath, { flags: 'a' });
const debugLogStream = fs.createWriteStream(debugLogPath, { flags: 'a' });

function logRequest(req, res, next) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} ${req.method} ${req.url} ${req.ip}\n`;
    accessLogStream.write(logEntry);
    next();
}

function logError(err, req, res, next) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} ERROR: ${err.stack}\n`;
    errorLogStream.write(logEntry);
    next(err);
}

module.exports = { logRequest, logError };
