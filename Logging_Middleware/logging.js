// logging.js - Reusable Logging Middleware for Node.js

const fetch = require('node-fetch');

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

// Valid values for validation
const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];
const COMMON_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

class Logger {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    validateInput(options) {
        // Validate stack
        if (!VALID_STACKS.includes(options.stack)) {
            console.error('Invalid stack value. Must be "backend" or "frontend"');
            return false;
        }

        // Validate level
        if (!VALID_LEVELS.includes(options.level)) {
            console.error('Invalid level value');
            return false;
        }

        // Validate package based on stack
        if (options.stack === 'backend' && 
            ![...BACKEND_PACKAGES, ...COMMON_PACKAGES].includes(options.package)) {
            console.error('Invalid package for backend stack');
            return false;
        }

        if (options.stack === 'frontend' && 
            ![...FRONTEND_PACKAGES, ...COMMON_PACKAGES].includes(options.package)) {
            console.error('Invalid package for frontend stack');
            return false;
        }

        return true;
    }

    async log(options) {
        if (!this.validateInput(options)) {
            return null;
        }

        try {
            const response = await fetch(LOG_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: JSON.stringify({
                    stack: options.stack,
                    level: options.level,
                    package: options.package,
                    message: options.message
                })
            });

            if (!response.ok) {
                throw new Error(`Log API request failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to send log:', error);
            return null;
        }
    }
}

// Convenience function for quick logging
async function Log(stack, level, pkg, message, accessToken) {
    const logger = new Logger(accessToken);
    return logger.log({ stack, level, package: pkg, message });
}

module.exports = { Logger, Log }; 