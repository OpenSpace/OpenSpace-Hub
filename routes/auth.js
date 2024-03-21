const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const utility = require('./../utils/utility')


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
 *              description: error message (User already exists / Password and confirm password do not match). 
 */
router.post('/register', async (req, res) => {
    try {
        const {firstname, lastname, username, password, cnfPassword} = req.body;
        if (password !== cnfPassword) {
            throw new Error('Password and confirm password do not match');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOne( {username} );
        if (user) {
            throw new Error('User already exists');
        }
        const newUser = new User({ 
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: hashedPassword,
            created: utility.getFormattedDate(new Date()),
            modified: utility.getFormattedDate(new Date())
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        res.status(500).json({ error: error.message});
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
        res.status(200).json({ token, username: user.username, firstname: user.firstname, lastname: user.lastname, link: user.link,
            thumbnail: user.thumbnail, institution: user.institution, favorites: user.favorites});
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/verify-token', async (req, res) => {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request' });
        }
        try {
            jwt.verify(token, process.env.SECRET_KEY);
            res.status(200).json({ message: 'Token verified successfully'});
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: 'Unauthorized request' });
        }
});

module.exports = router;