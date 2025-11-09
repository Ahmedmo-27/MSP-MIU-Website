const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Generate JWT token
 */
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { university_id, password } = req.body;

        // Validation
        if (!university_id || !password) {
            return res.status(400).json({
                success: false,
                error: 'University ID and password are required'
            });
        }

        // Validate university ID format (xxxx/xxxxx)
        const universityIdRegex = /^\d{4}\/\d{5}$/;
        if (!universityIdRegex.test(university_id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid university ID format. Expected format: xxxx/xxxxx (e.g. 20xx/xxxxx)'
            });
        }

        // Find user by university_id
        const user = await User.findOne({ where: { university_id } });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                error: 'Account is inactive. Please contact administrator.'
            });
        }

        // Check if user has a password set
        if (!user.password_hash) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate token with user id, role, and department_id
        const token = jwt.sign(
            {
                id: user.user_id,
                userId: user.user_id, // Also include userId for backward compatibility
                role: user.role,
                department: user.department_id || null
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Return user data (without password) and token
        res.json({
            success: true,
            message: 'Login successful',
            token,
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
        console.error('Login error:', error);
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
        const token = generateToken(user.user_id, user.role);

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Account pending activation.',
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                role: user.role,
                is_active: user.is_active
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
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
        console.error('Get me error:', error);
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
        console.error('Change password error:', error);
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
        console.error('Logout error:', error);
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
        console.error('Verify token error:', error);
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

