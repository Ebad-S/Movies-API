// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: 'Request body incomplete, both email and password are required',
    });
  }

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'User already exists',
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await db('users').insert({ email, hash });

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Database error',
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    });
  }

  try {
    // Get user from database
    const user = await db('users')
      .where({ email })
      .first();

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Incorrect email or password"
      });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.hash);
    if (!validPassword) {
      return res.status(401).json({
        error: true,
        message: "Incorrect email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token: token,
      token_type: "Bearer",
      expires_in: 86400 // 24 hours in seconds
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: true,
      message: "Database error during login"
    });
  }
};

exports.register = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            error: true,
            message: "Request body incomplete, both email and password are required"
        });
    }

    try {
        // Check if user already exists
        const existingUser = await db('users')
            .where({ email })
            .first();

        if (existingUser) {
            return res.status(409).json({
                error: true,
                message: "User already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Insert new user
        await db('users').insert({
            email,
            hash
        });

        // Send success response
        res.status(201).json({
            message: "User created"
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: true,
            message: "Database error during registration"
        });
    }
};