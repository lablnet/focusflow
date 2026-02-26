type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ANSI escape codes for terminal colors
const colors = {
    reset: '\x1b[0m',
    debug: '\x1b[90m', // Gray
    info: '\x1b[36m',  // Cyan
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
};

class Logger {
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private formatPrefix(level: LogLevel): string {
        const timestamp = this.getTimestamp();
        const color = colors[level] || colors.reset;
        // e.g., [2023-11-20T12:00:00.000Z] [INFO]
        return `${color}[${timestamp}] [${level.toUpperCase()}]${colors.reset}`;
    }

    private shouldLogDebug(): boolean {
        // Log debug if explicitly set or if in development environment
        const env = process.env.NODE_ENV || 'development';
        return env === 'development' || process.env.DEBUG_LEVEL === 'debug';
    }

    public debug(...args: any[]): void {
        if (this.shouldLogDebug()) {
            console.debug(this.formatPrefix('debug'), ...args);
        }
    }

    public info(...args: any[]): void {
        console.info(this.formatPrefix('info'), ...args);
    }

    public warn(...args: any[]): void {
        console.warn(this.formatPrefix('warn'), ...args);
    }

    public error(...args: any[]): void {
        console.error(this.formatPrefix('error'), ...args);
    }
}

export const logger = new Logger();

// Preserved for backward compatibility
export function dlog(...args: any[]): void {
    logger.debug(...args);
}
