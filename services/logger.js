import fs from 'fs';
import path from 'path';

/**
 * Production-level error logger
 * Logs errors to errors.txt in the project root directory
 */
export function logError(error, context = 'General') {
    try {
        const logFilePath = path.resolve(process.cwd(), 'errors.txt');
        const timestamp = new Date().toLocaleString(); // More readable for logs
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
        
        const logEntry = `
[${timestamp}] [CONTEXT: ${context}]
ERROR: ${errorMessage}
STACK: ${errorStack}
--------------------------------------------------------------------------------
`;

        // Append to file, create if it doesn't exist
        fs.appendFileSync(logFilePath, logEntry, 'utf8');
        
        // Also log to console for standard log management (PM2, Docker, etc.)
        console.error(`[LOGGED TO FILE] ${context}: ${errorMessage}`);
    } catch (loggingErr) {
        // Fallback to console if filesystem is restricted
        console.error('Failed to write to error log file:', loggingErr);
        console.error('Original Error:', error);
    }
}
