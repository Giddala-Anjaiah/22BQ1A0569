// logging.ts - Reusable Logging Middleware

type Stack = 'backend' | 'frontend';
type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type BackendPackage = 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service';
type FrontendPackage = 'api' | 'component' | 'hook' | 'page' | 'state' | 'style';
type CommonPackage = 'auth' | 'config' | 'middleware' | 'utils';
type Package = BackendPackage | FrontendPackage | CommonPackage;

interface LogResponse {
    logID: string;
    message: string;
}

interface LogOptions {
    stack: Stack;
    level: Level;
    package: Package;
    message: string;
    accessToken?: string;
}

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

class Logger {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private validateInput(options: LogOptions): boolean {
        // Validate stack
        if (!['backend', 'frontend'].includes(options.stack)) {
            console.error('Invalid stack value. Must be "backend" or "frontend"');
            return false;
        }

        // Validate level
        if (!['debug', 'info', 'warn', 'error', 'fatal'].includes(options.level)) {
            console.error('Invalid level value');
            return false;
        }

        // Validate package based on stack
        const backendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
        const frontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'];
        const commonPackages = ['auth', 'config', 'middleware', 'utils'];

        if (options.stack === 'backend' && 
            ![...backendPackages, ...commonPackages].includes(options.package)) {
            console.error('Invalid package for backend stack');
            return false;
        }

        if (options.stack === 'frontend' && 
            ![...frontendPackages, ...commonPackages].includes(options.package)) {
            console.error('Invalid package for frontend stack');
            return false;
        }

        return true;
    }

    public async log(options: LogOptions): Promise<LogResponse | null> {
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

            return await response.json() as LogResponse;
        } catch (error) {
            console.error('Failed to send log:', error);
            return null;
        }
    }
}

// Convenience function for quick logging
export async function Log(stack: Stack, level: Level, pkg: Package, message: string, accessToken: string): Promise<LogResponse | null> {
    const logger = new Logger(accessToken);
    return logger.log({ stack, level, package: pkg, message });
}

// Export the Logger class for more controlled usage
export default Logger; 