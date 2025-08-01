# Logging Middleware

## Overview
A comprehensive logging middleware for Express.js applications that tracks HTTP requests and responses with detailed information including timestamps, request/response bodies, headers, and performance metrics.

## Features

### ✅ Request Logging
- HTTP method and URL
- Request headers
- Request body (JSON, form data)
- Query parameters
- Route parameters
- Client IP address
- User agent information
- Timestamp

### ✅ Response Logging
- HTTP status code and message
- Response headers
- Response body
- Response time calculation
- Completion timestamp

### ✅ File Management
- Daily log files (app-YYYY-MM-DD.log)
- Automatic log directory creation
- Log rotation and cleanup
- JSON formatted log entries

### ✅ Performance Tracking
- Request processing time
- Response time metrics
- Total request lifecycle timing

## Installation

```bash
# Copy logger.js to your project
cp logger.js ./your-project/
```

## Usage

### Basic Setup

```javascript
const express = require('express');
const { logger } = require('./logger');

const app = express();

// Apply logging middleware
app.use(logger);

// Your routes here
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### Advanced Usage

```javascript
const express = require('express');
const { logger, getLogs, clearOldLogs } = require('./logger');

const app = express();

// Apply logging middleware
app.use(logger);

// API endpoint to view logs
app.get('/logs', (req, res) => {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const logs = getLogs(date);
    res.json({ date, logs, count: logs.length });
});

// API endpoint to clear old logs
app.post('/logs/clear', (req, res) => {
    const daysToKeep = req.body.daysToKeep || 7;
    clearOldLogs(daysToKeep);
    res.json({ message: 'Old logs cleared successfully' });
});
```

## Log Format

Each log entry contains:

```json
{
  "request": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "method": "POST",
    "url": "/api/users",
    "headers": { ... },
    "body": { "name": "John", "email": "john@example.com" },
    "query": { "page": "1" },
    "params": { "id": "123" },
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "response": {
    "timestamp": "2024-01-15T10:30:00.150Z",
    "statusCode": 201,
    "statusMessage": "Created",
    "headers": { ... },
    "body": { "id": 456, "name": "John" },
    "responseTime": "150ms"
  },
  "totalTime": "150ms"
}
```

## Configuration

### Log Directory
Logs are stored in a `logs` directory relative to the logger.js file location.

### File Naming
- Format: `app-YYYY-MM-DD.log`
- Example: `app-2024-01-15.log`

### Log Rotation
- Automatic daily file creation
- Configurable cleanup of old files
- Default retention: 7 days

## API Reference

### `logger(req, res, next)`
Main middleware function to be used with Express.js.

### `getLogs(date)`
Retrieve logs for a specific date.
- **Parameters:** `date` (string) - Date in YYYY-MM-DD format
- **Returns:** Array of log entries

### `clearOldLogs(daysToKeep)`
Remove log files older than specified days.
- **Parameters:** `daysToKeep` (number) - Number of days to retain logs
- **Default:** 7 days

## Console Output

The middleware provides real-time console logging:

```
[2024-01-15T10:30:00.000Z] POST /api/users - Request received
[2024-01-15T10:30:00.150Z] POST /api/users - 201 (150ms)
```

## Error Handling

- Automatic log directory creation
- Graceful file write error handling
- JSON parsing error recovery
- Missing file handling

## Performance Considerations

- Minimal overhead on request processing
- Asynchronous file writing
- Efficient memory usage
- Configurable log retention

## Security Notes

- Sensitive data in headers/body will be logged
- Consider filtering sensitive information in production
- Log files should be properly secured
- Implement log rotation for disk space management

## Production Recommendations

1. **Filter Sensitive Data:** Remove passwords, tokens, etc.
2. **Log Rotation:** Implement automatic cleanup
3. **Monitoring:** Set up alerts for error rates
4. **Backup:** Regular log file backups
5. **Access Control:** Secure log file access

## Example Implementation

See the `Backend_Test_Submission/app.js` file for a complete implementation example with this logging middleware.

## External Logging API Integration

This middleware also includes integration with the external logging API at `http://20.244.56.144/evaluation-service/logs`.

### Usage with External API

```javascript
const { Logger, Log } = require('./logging');

// Your access token from OAuth
const ACCESS_TOKEN = "your-access-token-here";

// Quick logging
await Log("backend", "info", "service", "User service initialized", ACCESS_TOKEN);

// Using Logger class
const logger = new Logger(ACCESS_TOKEN);
await logger.log({
    stack: 'backend',
    level: 'error',
    package: 'handler',
    message: 'Database connection failed'
});
```

### Valid Values

**Stack:** `backend`, `frontend`

**Level:** `debug`, `info`, `warn`, `error`, `fatal`

**Backend Packages:** `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`

**Frontend Packages:** `api`, `component`, `hook`, `page`, `state`, `style`

**Common Packages:** `auth`, `config`, `middleware`, `utils`

### Test the Logging

Run the test file to verify the logging middleware:

```bash
cd Logging_Middleware
node test-logging.js
``` 