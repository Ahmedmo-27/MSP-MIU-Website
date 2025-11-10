/**
 * JWT Utility
 * Provides secure JWT token generation with validation
 */

const jwt = require('jsonwebtoken');

/**
 * Validate JWT secret is properly set and meets security requirements
 * @returns {Object} - { valid: boolean, secret: string, error?: string }
 */
const validateJWTSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return {
            valid: false,
            secret: null,
            error: 'JWT_SECRET environment variable is not set'
        };
    }

    if (typeof secret !== 'string') {
        return {
            valid: false,
            secret: null,
            error: 'JWT_SECRET must be a string'
        };
    }

    // Minimum length requirement for security (at least 32 characters)
    if (secret.length < 32) {
        return {
            valid: false,
            secret: null,
            error: 'JWT_SECRET must be at least 32 characters long for security'
        };
    }

    // Check for common weak secrets
    const weakSecrets = ['secret', 'password', '123456', 'jwt_secret', 'changeme'];
    if (weakSecrets.some(weak => secret.toLowerCase().includes(weak))) {
        return {
            valid: false,
            secret: null,
            error: 'JWT_SECRET appears to be weak or default value'
        };
    }

    return {
        valid: true,
        secret: secret
    };
};

/**
 * Get JWT expiration time with fallback
 * @returns {string} - JWT expiration time (default: '7d')
 */
const getJWTExpiration = () => {
    const expiresIn = process.env.JWT_EXPIRES_IN;
    
    // Validate expiration format if provided
    if (expiresIn) {
        // Basic validation: should be a number followed by a time unit (s, m, h, d)
        const expirationRegex = /^\d+[smhd]$/;
        if (!expirationRegex.test(expiresIn)) {
            console.warn(`Invalid JWT_EXPIRES_IN format: ${expiresIn}. Using default: 7d`);
            return '7d';
        }
        return expiresIn;
    }

    // Default to 7 days
    return '7d';
};

/**
 * Generate JWT token with validation
 * @param {Object} payload - Token payload
 * @returns {Object} - { success: boolean, token?: string, error?: string }
 */
const generateToken = (payload) => {
    try {
        // Validate JWT secret
        const secretValidation = validateJWTSecret();
        if (!secretValidation.valid) {
            return {
                success: false,
                error: secretValidation.error
            };
        }

        // Validate payload
        if (!payload || typeof payload !== 'object') {
            return {
                success: false,
                error: 'Invalid token payload'
            };
        }

        // Get expiration time
        const expiresIn = getJWTExpiration();

        // Generate token
        const token = jwt.sign(
            payload,
            secretValidation.secret,
            { expiresIn }
        );

        return {
            success: true,
            token
        };
    } catch (error) {
        return {
            success: false,
            error: `Token generation failed: ${error.message}`
        };
    }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - { success: boolean, decoded?: Object, error?: string }
 */
const verifyToken = (token) => {
    try {
        // Validate JWT secret
        const secretValidation = validateJWTSecret();
        if (!secretValidation.valid) {
            return {
                success: false,
                error: secretValidation.error
            };
        }

        if (!token || typeof token !== 'string') {
            return {
                success: false,
                error: 'Invalid token format'
            };
        }

        // Verify token
        const decoded = jwt.verify(token, secretValidation.secret);
        return {
            success: true,
            decoded
        };
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return {
                success: false,
                error: 'Invalid token'
            };
        }
        if (error.name === 'TokenExpiredError') {
            return {
                success: false,
                error: 'Token expired'
            };
        }
        return {
            success: false,
            error: `Token verification failed: ${error.message}`
        };
    }
};

module.exports = {
    validateJWTSecret,
    getJWTExpiration,
    generateToken,
    verifyToken
};

