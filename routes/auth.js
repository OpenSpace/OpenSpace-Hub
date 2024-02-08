const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary: Creates a new user
 *      description: Register a new user
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: user
 *            description: The user to create.
 *            schema:
 *              type: object
 *            required:
 *              - username
 *            properties:
 *              username:
 *                  type: string
 *      responses:
 *          201:
 *              description: User registered successfully.
 *          500:
 *              description: Internal server error. Registration failed.
 */
router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword});
        await user.save();
        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Registration failed'});
    }
});

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: User Login
 *      description: user login api
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: user
 *            description: The user to create.
 *            schema:
 *              type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                  type: string
 *              password:
 *                  type: string
 *      responses:
 *          201:
 *              description: User logged in successfully.
 *          401:
 *              description: Authentication failed.
 *          500:
 *              description: Internal server error. Login failed.
 */
router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne( {username} );
        if (!user) {
            return res.status(401).json({ error : 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json( { error: 'Authentication failed'});
        }
        const token = jwt.sign( {userId : user._id }, process.env.SECRET_KEY, { expiresIn: '1h', });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;