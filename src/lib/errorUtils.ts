/**
 * Sanitizes and maps Firebase error messages to user-friendly text.
 * Ensures that the technical "Firebase:" prefix is never shown to the user.
 */
export const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return 'An unexpected error occurred. Please try again.';

    // If it's a string, just clean it up
    if (typeof error === 'string') {
        return error.replace(/Firebase:\s*/gi, '').trim();
    }

    // Handle Firebase Error objects
    const code = error.code || '';
    const message = error.message || '';

    // Mapping for common Firebase Auth error codes
    const authErrorMap: Record<string, string> = {
        'auth/invalid-credential': 'The email or password you entered is incorrect. Please try again.',
        'auth/user-not-found': 'No account found with this email. Please check the spelling or sign up.',
        'auth/wrong-password': 'The password you entered is incorrect. Please try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
        'auth/weak-password': 'Your password is too weak. Please use at least 6 characters.',
        'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
        'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later or reset your password.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/operation-not-allowed': 'This sign-in method is currently disabled.',
        'auth/requires-recent-login': 'For security, please log in again before making this change.',
    };

    // If the code is in our map, return the friendly message
    if (code && authErrorMap[code]) {
        return authErrorMap[code];
    }

    // Generic cleanup for unknown errors
    // Removest the "Firebase: " prefix and any trailing (auth/...) codes
    let cleanMessage = message.replace(/Firebase:\s*/gi, '').replace(/\s*\(auth\/.*\)\.?/gi, '').trim();

    if (!cleanMessage || cleanMessage.toLowerCase() === 'error') {
        return 'An error occurred while processing your request. Please try again.';
    }

    return cleanMessage;
};
