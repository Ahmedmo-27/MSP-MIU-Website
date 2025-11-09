const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

/**
 * Register user (only through invitation)
 * Triggered via Nodemailer link from accepted applicant email
 * POST /api/users/register
 */
const registerUser = async (req, res) => {
    try {
        const { full_name, university_id, email, password } = req.body;

        // Validation
        if (!full_name || !university_id || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required: full_name, university_id, email, password'
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
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { university_id }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User with this email or university ID already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with role 'member' and is_active = true (since they're invited)
        const user = await User.create({
            full_name,
            university_id,
            email,
            password_hash: hashedPassword,
            role: 'member',
            is_active: true
        });

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user_id: user.user_id
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed'
        });
    }
};

/**
 * Login user
 * POST /api/users/login
 * Requires university_id (format: "20xx/xxxxx") and password
 */
const loginUser = async (req, res) => {
    try {
        const { university_id, password } = req.body;

        // Validation - require university_id and password
        if (!university_id || !password) {
            return res.status(400).json({
                success: false,
                error: 'University ID and password are required'
            });
        }

        // Find user by university_id
        // University ID format: "20xx/xxxxx"
        const user = await User.findOne({ where: { university_id } });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found with this university ID'
            });
        }

        // Check if user has a password set
        if (!user.password_hash) {
            return res.status(401).json({
                success: false,
                error: 'User has no password set'
            });
        }

        // Verify password
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                error: 'Account is inactive. Please contact the administrator.'
            });
        }

        // Generate token with user id, role, and department_id
        const token = jwt.sign(
            {
                id: user.user_id,
                userId: user.user_id,
                role: user.role,
                department: user.department_id || null
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                university_id: user.university_id,
                role: user.role,
                is_active: user.is_active,
                department_id: user.department_id
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
};

/**
 * Logout user
 * POST /api/users/logout
 * Note: Since JWT tokens are stateless, logout is handled client-side by removing the token.
 * This endpoint confirms the logout and can be used for logging/auditing purposes.
 * Token is already verified by authenticateToken middleware, so req.user is available.
 */
const logoutUser = async (req, res) => {
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
            error: 'Failed to logout'
        });
    }
};

/**
 * Get user profile
 * GET /api/users/profile
 */
const getProfile = async (req, res) => {
    try {
        // User is attached by authenticateToken middleware
        const userId = req.user.user_id;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found with this ID'
            });
        }

        // Convert to plain object and add profile picture URL
        const userObj = user.toJSON();
        if (userObj.profile_picture) {
            userObj.profile_picture_url = `/uploads/${userObj.profile_picture}`;
        }

        res.json({
            success: true,
            user: userObj
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch profile'
        });
    }
};

/**
 * Update profile (name, picture, schedule)
 * PUT /api/users/profile
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { full_name, schedule } = req.body;
        const profile_picture = req.file ? req.file.filename : null;

        // Get user
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Prepare update data
        const updateData = {};
        if (full_name) updateData.full_name = full_name;
        if (profile_picture) {
            // Delete old profile picture if exists
            if (user.profile_picture) {
                const oldPicturePath = path.join(__dirname, '../uploads', user.profile_picture);
                if (fs.existsSync(oldPicturePath)) {
                    fs.unlinkSync(oldPicturePath);
                }
            }
            updateData.profile_picture = profile_picture;
        }
        if (schedule) {
            // Validate schedule is valid JSON
            try {
                const scheduleObj = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
                updateData.schedule = scheduleObj;
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid schedule format. Must be valid JSON.'
                });
            }
        }

        // Update user
        await user.update(updateData);

        // Get updated user (without password)
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password_hash'] }
        });

        // Convert to plain object and add profile picture URL
        const userObj = updatedUser.toJSON();
        if (userObj.profile_picture) {
            userObj.profile_picture_url = `/uploads/${userObj.profile_picture}`;
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: userObj
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update profile'
        });
    }
};

/**
 * Add score (for leaderboard)
 * POST /api/users/score
 */
const addScore = async (req, res) => {
    try {
        const { user_id, points } = req.body;

        // Validation
        if (!user_id || points === undefined) {
            return res.status(400).json({
                success: false,
                error: 'user_id and points are required'
            });
        }

        if (typeof points !== 'number' || points < 0) {
            return res.status(400).json({
                success: false,
                error: 'Points must be a positive number'
            });
        }

        // Get user
        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update score
        const newScore = (user.score || 0) + points;
        await user.update({ score: newScore });

        res.json({
            success: true,
            message: 'Score updated',
            user_id: user_id,
            new_score: newScore
        });

    } catch (error) {
        console.error('Add score error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update score'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile,
    addScore
};

