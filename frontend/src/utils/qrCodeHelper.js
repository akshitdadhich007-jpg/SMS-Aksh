/**
 * QR Code utilities for Traceback verification system
 */

/**
 * Generate a secure one-time QR code token
 * @param {string} claimId - The claim ID
 * @returns {object} Token info with token, expiry, and qrData
 */
export const generateQRToken = (claimId) => {
    const timestamp = Date.now();
    const expiryTime = timestamp + (30 * 60 * 1000); // 30 minutes
    const token = `TB-${claimId}-${timestamp}`;
    
    return {
        token,
        claimId,
        timestamp,
        expiryTime,
        qrData: token // This will be encoded into QR
    };
};

/**
 * Validate QR token
 * @param {string} scannedToken - Token scanned from QR code
 * @param {string} storedToken - Token stored in localStorage
 * @param {number} expiryTime - Expiry timestamp
 * @returns {object} Validation result with success and message
 */
export const validateQRToken = (scannedToken, storedToken, expiryTime) => {
    const now = Date.now();
    
    if (!storedToken) {
        return { success: false, message: 'No QR code generated yet.' };
    }
    
    if (now > expiryTime) {
        return { success: false, message: 'QR code has expired. Please generate a new one.' };
    }
    
    if (scannedToken !== storedToken) {
        return { success: false, message: 'Invalid QR code. Please try again.' };
    }
    
    return { success: true, message: 'QR code verified successfully.' };
};

/**
 * Format expiry time for display
 * @param {number} expiryTime - Expiry timestamp
 * @returns {string} Time remaining string
 */
export const getTimeRemaining = (expiryTime) => {
    const now = Date.now();
    const diff = expiryTime - now;
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds}s`;
};
