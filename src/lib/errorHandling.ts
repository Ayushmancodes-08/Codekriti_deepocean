/**
 * Error handling utilities for registration flow
 * Implements retry mechanism, error message mapping, and recovery strategies
 */

export interface RetryOptions {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
}

export interface RetryResult<T> {
    success: boolean;
    data?: T;
    error?: Error;
    attempts: number;
}

/**
 * Error types for better error handling
 */
export enum ErrorType {
    NETWORK_ERROR = 'NETWORK_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Detect error type from error object
 */
export function detectErrorType(error: unknown): ErrorType {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
            return ErrorType.NETWORK_ERROR;
        }

        if (message.includes('validation') || message.includes('invalid')) {
            return ErrorType.VALIDATION_ERROR;
        }

        if (message.includes('timeout')) {
            return ErrorType.TIMEOUT_ERROR;
        }

        if (message.includes('500') || message.includes('server')) {
            return ErrorType.SERVER_ERROR;
        }
    }

    return ErrorType.UNKNOWN_ERROR;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
    const errorType = detectErrorType(error);

    const messages: Record<ErrorType, string> = {
        [ErrorType.NETWORK_ERROR]:
            'Unable to connect to the server. Please check your internet connection and try again.',
        [ErrorType.VALIDATION_ERROR]:
            'There was a problem with your submission. Please check your information and try again.',
        [ErrorType.SERVER_ERROR]:
            'Our servers are experiencing issues. Please try again in a few moments.',
        [ErrorType.TIMEOUT_ERROR]:
            'The request took too long to complete. Please try again.',
        [ErrorType.UNKNOWN_ERROR]:
            'An unexpected error occurred. Please try again or contact support if the problem persists.',
    };

    return messages[errorType];
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
    const errorType = detectErrorType(error);

    // Don't retry validation errors
    if (errorType === ErrorType.VALIDATION_ERROR) {
        return false;
    }

    return true;
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<RetryResult<T>> {
    const {
        maxAttempts = 3,
        initialDelay = 1000,
        maxDelay = 10000,
        backoffMultiplier = 2,
    } = options;

    let attempts = 0;
    let delay = initialDelay;
    let lastError: Error | undefined;

    while (attempts < maxAttempts) {
        attempts++;

        try {
            const data = await fn();
            return {
                success: true,
                data,
                attempts,
            };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            // Don't retry validation errors
            if (!isRetryableError(error)) {
                return {
                    success: false,
                    error: lastError,
                    attempts,
                };
            }

            // If this was the last attempt, don't wait
            if (attempts >= maxAttempts) {
                break;
            }

            // Wait before retrying
            await sleep(delay);

            // Increase delay for next attempt (exponential backoff)
            delay = Math.min(delay * backoffMultiplier, maxDelay);
        }
    }

    return {
        success: false,
        error: lastError,
        attempts,
    };
}

/**
 * Mock API call for testing
 * In production, replace with actual API endpoint
 */
export async function submitRegistration<T>(data: T): Promise<{ id: string; data: T }> {
    // Simulate network delay
    await sleep(1000 + Math.random() * 1000);

    // Simulate random failures for testing (10% chance)
    if (Math.random() < 0.1) {
        throw new Error('Network error: Failed to connect to server');
    }

    // Success case
    return {
        id: Date.now().toString(36).toUpperCase(),
        data,
    };
}

/**
 * Submit registration with retry
 */
export async function submitRegistrationWithRetry<T>(
    data: T,
    options?: RetryOptions
): Promise<RetryResult<{ id: string; data: T }>> {
    return retryWithBackoff(() => submitRegistration(data), options);
}

/**
 * Check if browser is online
 */
export function isOnline(): boolean {
    return navigator.onLine;
}

/**
 * Wait for online status
 */
export function waitForOnline(timeout = 30000): Promise<boolean> {
    return new Promise((resolve) => {
        if (isOnline()) {
            resolve(true);
            return;
        }

        const timeoutId = setTimeout(() => {
            window.removeEventListener('online', onlineHandler);
            resolve(false);
        }, timeout);

        const onlineHandler = () => {
            clearTimeout(timeoutId);
            window.removeEventListener('online', onlineHandler);
            resolve(true);
        };

        window.addEventListener('online', onlineHandler);
    });
}

/**
 * Error recovery suggestions based on error type
 */
export function getErrorRecoverySuggestions(error: unknown): string[] {
    const errorType = detectErrorType(error);

    const suggestions: Record<ErrorType, string[]> = {
        [ErrorType.NETWORK_ERROR]: [
            'Check your internet connection',
            'Try again in a few moments',
            'Your progress has been saved and will be restored when you return',
        ],
        [ErrorType.VALIDATION_ERROR]: [
            'Review your form entries for errors',
            'Ensure all required fields are filled correctly',
            'Contact support if you believe this is an error',
        ],
        [ErrorType.SERVER_ERROR]: [
            'Our servers are experiencing high traffic',
            'Please wait a few minutes and try again',
            'Your progress has been saved',
        ],
        [ErrorType.TIMEOUT_ERROR]: [
            'The request took too long',
            'Try again with a better internet connection',
            'Your progress has been saved',
        ],
        [ErrorType.UNKNOWN_ERROR]: [
            'Try refreshing the page',
            'Clear your browser cache and try again',
            'Contact support if the problem persists',
        ],
    };

    return suggestions[errorType];
}
