/**
 * Secure Logger Utility
 * Provides audit logging and sanitized error logging without exposing sensitive information
 */

/**
 * Sanitize error object to remove sensitive information
 * @param {Error} error - The error object to sanitize
 * @returns {Object} - Sanitized error information
 */
const sanitizeError = (error) => {
    if (!error) return null;

    const sanitized = {
        name: error.name || 'Error',
        message: error.message || 'An error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    // Remove sensitive fields that might be in error objects
    const sensitiveKeys = ['password', 'password_hash', 'token', 'secret', 'key', 'api_key', 'authorization'];
    
    if (error.data && typeof error.data === 'object') {
        sanitized.data = {};
        for (const key in error.data) {
            if (!sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
                sanitized.data[key] = error.data[key];
            } else {
                sanitized.data[key] = '[REDACTED]';
            }
        }
    }

    return sanitized;
};

/**
 * Get client IP address from request
 * @param {Object} req - Express request object
 * @returns {string} - Client IP address
 */
const getClientIp = (req) => {
    return req.ip || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() ||
           'unknown';
};

/**
 * Log audit event (login attempts, security events, etc.)
 * @param {string} event - Event type (e.g., 'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'REGISTRATION')
 * @param {Object} details - Event details
 * @param {Object} req - Express request object (optional)
 */
const logAuditEvent = (event, details = {}, req = null) => {
    const timestamp = new Date().toISOString();
    const clientIp = req ? getClientIp(req) : 'unknown';
    const userAgent = req?.headers['user-agent'] || 'unknown';

    const auditLog = {
        timestamp,
        event,
        clientIp,
        userAgent,
        ...details
    };

    // In production, this should be sent to a proper logging service
    // For now, we'll use console with a structured format
    console.log('[AUDIT]', JSON.stringify(auditLog));
};

/**
 * Log error securely without exposing sensitive information
 * @param {string} context - Context where error occurred (e.g., 'auth.login')
 * @param {Error} error - Error object
 * @param {Object} additionalInfo - Additional context information (will be sanitized)
 * @param {Object} req - Express request object (optional)
 */
const logError = (context, error, additionalInfo = {}, req = null) => {
    const timestamp = new Date().toISOString();
    const sanitizedError = sanitizeError(error);
    const clientIp = req ? getClientIp(req) : 'unknown';

    // Sanitize additional info
    const sanitizedInfo = { ...additionalInfo };
    const sensitiveKeys = ['password', 'password_hash', 'token', 'secret', 'key', 'api_key'];
    for (const key in sanitizedInfo) {
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
            sanitizedInfo[key] = '[REDACTED]';
        }
    }

    const errorLog = {
        timestamp,
        context,
        clientIp,
        error: sanitizedError,
        additionalInfo: Object.keys(sanitizedInfo).length > 0 ? sanitizedInfo : undefined
    };

    // Log to console (in production, send to logging service)
    console.error('[ERROR]', JSON.stringify(errorLog));
};

/**
 * Log security event
 * @param {string} event - Security event type
 * @param {Object} details - Event details
 * @param {Object} req - Express request object (optional)
 */
const logSecurityEvent = (event, details = {}, req = null) => {
    logAuditEvent(`SECURITY_${event}`, details, req);
};

module.exports = {
    logAuditEvent,
    logError,
    logSecurityEvent,
    sanitizeError,
    getClientIp
};

