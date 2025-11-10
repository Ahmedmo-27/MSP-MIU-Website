const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateToken: generateJWTToken } = require('../utils/jwt');
const { logAuditEvent, logError, logSecurityEvent } = require('../utils/logger');

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    const startTime = Date.now();
    let loginAttempt = {
        university_id: req.body?.university_id || 'unknown',
        success: false,
        error_type: null
    };

    try {
        const { university_id, password } = req.body;

        // Validation
        if (!university_id || !password) {
            loginAttempt.error_type = 'MISSING_CREDENTIALS';
            logAuditEvent('LOGIN_FAILURE', {
                reason: 'Missing credentials',
                university_id: university_id || 'not_provided'
            }, req);
            
            return res.status(400).json({
                success: false,
                error: 'University ID and password are required'
            });
        }

        // Validate university ID format (xxxx/xxxxx)
        const universityIdRegex = /^\d{4}\/\d{5}$/;
        if (!universityIdRegex.test(university_id)) {
            loginAttempt.error_type = 'INVALID_FORMAT';
            logAuditEvent('LOGIN_FAILURE', {
                reason: 'Invalid university ID format',
                university_id
            }, req);
            
            return res.status(400).json({
                success: false,
                error: 'Invalid university ID format. Expected format: xxxx/xxxxx (e.g. 20xx/xxxxx)'
            });
        }

        // Find user by university_id
        const user = await User.findOne({ where: { university_id } });

        if (!user) {
            loginAttempt.error_type = 'USER_NOT_FOUND';
            logAuditEvent('LOGIN_FAILURE', {
                reason: 'User not found',
                university_id
            }, req);
            
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            loginAttempt.error_type = 'ACCOUNT_INACTIVE';
            loginAttempt.user_id = user.user_id;
            logSecurityEvent('LOGIN_BLOCKED', {
                reason: 'Account inactive',
                user_id: user.user_id,
                university_id
            }, req);
            
            return res.status(403).json({
                success: false,
                error: 'Account is inactive. Please contact administrator.'
            });
        }

        // Check if user has a password set
        if (!user.password_hash) {
            loginAttempt.error_type = 'NO_PASSWORD_SET';
            loginAttempt.user_id = user.user_id;
            logSecurityEvent('LOGIN_FAILURE', {
                reason: 'No password set',
                user_id: user.user_id,
                university_id
            }, req);
            
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            loginAttempt.error_type = 'INVALID_PASSWORD';
            loginAttempt.user_id = user.user_id;
            logAuditEvent('LOGIN_FAILURE', {
                reason: 'Invalid password',
                user_id: user.user_id,
                university_id
            }, req);
            
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate token with user id, role, and department_id
        const tokenResult = generateJWTToken({
            id: user.user_id,
            userId: user.user_id, // Also include userId for backward compatibility
            role: user.role,
            department: user.department_id || null
        });

        if (!tokenResult.success) {
            loginAttempt.error_type = 'TOKEN_GENERATION_FAILED';
            loginAttempt.user_id = user.user_id;
            logError('auth.login', new Error(tokenResult.error), {
                user_id: user.user_id,
                university_id
            }, req);
            
            return res.status(500).json({
                success: false,
                error: 'Authentication failed. Please try again later.'
            });
        }

        // Log successful login
        loginAttempt.success = true;
        loginAttempt.user_id = user.user_id;
        const loginDuration = Date.now() - startTime;
        logAuditEvent('LOGIN_SUCCESS', {
            user_id: user.user_id,
            university_id: user.university_id,
            role: user.role,
            department_id: user.department_id,
            duration_ms: loginDuration
        }, req);

        // Return user data (without password) and token
        res.json({
            success: true,
            message: 'Login successful',
            token: tokenResult.token,
            user: {
                user_id: user.user_id,
                university_id: user.university_id,
                full_name: user.full_name || null,
                email: user.email,
                role: user.role,
                is_active: user.is_active,
                department_id: user.department_id
            }
        });

    } catch (error) {
        loginAttempt.error_type = 'INTERNAL_ERROR';
        logError('auth.login', error, {
            university_id: loginAttempt.university_id,
            user_id: loginAttempt.user_id
        }, req);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Determine user role (default to 'member' if not provided or invalid)
        const validRoles = ['member', 'board', 'admin'];
        const userRole = role && validRoles.includes(role) ? role : 'member';

        // Create user (default to inactive, admin must activate)
        const user = await User.create({
            email,
            password_hash,
            role: userRole,
            is_active: false // Default to inactive, require admin activation
        });

        // Generate token
        const tokenResult = generateJWTToken({
            userId: user.user_id,
            id: user.user_id,
            role: user.role
        });

        if (!tokenResult.success) {
            logError('auth.register', new Error(tokenResult.error), {
                email,
                user_id: user.user_id
            }, req);
            
            // Delete user if token generation failed
            await user.destroy();
            
            return res.status(500).json({
                success: false,
                error: 'Registration failed. Please try again later.'
            });
        }

        // Log registration
        logAuditEvent('REGISTRATION_SUCCESS', {
            user_id: user.user_id,
            email,
            role: user.role
        }, req);

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Account pending activation.',
            token: tokenResult.token,
            user: {
                user_id: user.user_id,
                email: user.email,
                role: user.role,
                is_active: user.is_active
            }
        });

    } catch (error) {
        // Determine error type for better error messages
        let errorMessage = 'Registration failed';
        let statusCode = 500;

        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = 'User with this email already exists';
            statusCode = 409;
        } else if (error.name === 'SequelizeValidationError') {
            errorMessage = 'Invalid input data';
            statusCode = 400;
        }

        logError('auth.register', error, {
            email: req.body?.email || 'unknown',
            error_name: error.name
        }, req);
        
        res.status(statusCode).json({
            success: false,
            error: errorMessage
        });
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        // User is already attached to req by authenticateToken middleware
        const user = await User.findByPk(req.user.user_id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                user_id: user.user_id,
                university_id: user.university_id,
                full_name: user.full_name || null,
                email: user.email,
                role: user.role,
                is_active: user.is_active,
                department_id: user.department_id,
                created_at: user.created_at
            }
        });

    } catch (error) {
        logError('auth.getMe', error, {
            user_id: req.user?.user_id
        }, req);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Change password
 * POST /api/auth/change-password
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'New password must be at least 6 characters long'
            });
        }

        // Get user with password hash
        const user = await User.findByPk(req.user.user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await user.update({ password_hash });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        logError('auth.changePassword', error, {
            user_id: req.user?.user_id
        }, req);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 * Note: Since JWT tokens are stateless, logout is handled client-side by removing the token.
 * This endpoint confirms the logout and can be used for logging/auditing purposes.
 */
const logout = async (req, res) => {
    try {
        // Token is already verified by authenticateToken middleware
        // User info is available in req.user if needed for logging
        
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        logError('auth.logout', error, {
            user_id: req.user?.user_id
        }, req);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

/**
 * Verify token (for frontend to check if token is still valid)
 * GET /api/auth/verify
 */
const verifyToken = async (req, res) => {
    try {
        // If middleware passed, token is valid
        res.json({
            success: true,
            message: 'Token is valid',
            user: {
                user_id: req.user.user_id,
                university_id: req.user.university_id || null,
                full_name: req.user.full_name || null,
                email: req.user.email,
                role: req.user.role,
                is_active: req.user.is_active,
                department_id: req.user.department_id || null
            }
        });
    } catch (error) {
        logError('auth.verifyToken', error, {
            user_id: req.user?.user_id
        }, req);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    login,
    register,
    logout,
    getMe,
    changePassword,
    verifyToken
};

