/**
 * Custom Logging Middleware for Express.js
 * Tracks HTTP requests and responses with detailed information
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Custom logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const logger = (req, res, next) => {
    const startTime = new Date();
    const timestamp = startTime.toISOString();
    
    // Capture request details
    const requestLog = {
        timestamp,
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
    };

    // Log request
    console.log(`[${timestamp}] ${req.method} ${req.url} - Request received`);
    
    // Override res.end to capture response
    const originalEnd = res.end;
    const chunks = [];
    
    res.end = function(chunk) {
        if (chunk) {
            chunks.push(chunk);
        }
        
        const endTime = new Date();
        const responseTime = endTime - startTime;
        const responseBody = Buffer.concat(chunks).toString('utf8');
        
        // Capture response details
        const responseLog = {
            timestamp: endTime.toISOString(),
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.getHeaders(),
            body: responseBody,
            responseTime: `${responseTime}ms`
        };
        
        // Create complete log entry
        const logEntry = {
            request: requestLog,
            response: responseLog,
            totalTime: `${responseTime}ms`
        };
        
        // Log to console
        console.log(`[${endTime.toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${responseTime}ms)`);
        
        // Write to file
        writeToLogFile(logEntry);
        
        // Call original end method
        originalEnd.call(this, chunk);
    };
    
    next();
};

/**
 * Write log entry to file
 * @param {Object} logEntry - Complete log entry object
 */
const writeToLogFile = (logEntry) => {
    const today = new Date().toISOString().split('T')[0];
    const logFileName = `app-${today}.log`;
    const logFilePath = path.join(logsDir, logFileName);
    
    const logString = JSON.stringify(logEntry, null, 2) + '\n---\n';
    
    fs.appendFile(logFilePath, logString, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
};

/**
 * Get logs for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} Array of log entries
 */
const getLogs = (date = new Date().toISOString().split('T')[0]) => {
    const logFileName = `app-${date}.log`;
    const logFilePath = path.join(logsDir, logFileName);
    
    if (!fs.existsSync(logFilePath)) {
        return [];
    }
    
    try {
        const logContent = fs.readFileSync(logFilePath, 'utf8');
        const logEntries = logContent.split('---\n').filter(entry => entry.trim());
        return logEntries.map(entry => {
            try {
                return JSON.parse(entry.trim());
            } catch (e) {
                return { raw: entry.trim() };
            }
        });
    } catch (error) {
        console.error('Error reading log file:', error);
        return [];
    }
};

/**
 * Clear old log files (older than specified days)
 * @param {number} daysToKeep - Number of days to keep logs
 */
const clearOldLogs = (daysToKeep = 7) => {
    const files = fs.readdirSync(logsDir);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    files.forEach(file => {
        if (file.startsWith('app-') && file.endsWith('.log')) {
            const filePath = path.join(logsDir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.mtime < cutoffDate) {
                fs.unlinkSync(filePath);
                console.log(`Deleted old log file: ${file}`);
            }
        }
    });
};

module.exports = {
    logger,
    getLogs,
    clearOldLogs
};
