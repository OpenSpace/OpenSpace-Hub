const express = require('express');
const router = express.Router();
const Config = require('./../models/Config');
const User = require('./../models/User');
const Model = require('../models/Model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authUtility = require('./../utils/authUtility')
const { validationResult } = require('express-validator');


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
 *              - email
 *            properties:
 *              email:
 *                  type: string
 *      responses:
 *          201:
 *              description: User registered successfully.
 *          500:
 *              description: error message (User already exists / Password and confirm password do not match). 
 */
router.post('/register', async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let config = await Config.findOne();
        if (!config.signin) {
            throw new Error('Signup disabled');
        }

        const { name, email, password, cnfPassword } = req.body;
        authUtility.validatePassword(password, cnfPassword);
        let user = await User.findOne({ email });
        if (user) {
            throw new Error('User already exists');
        }
        const domain = 'OpenSpace';
        const pictureUrl = 'defaults/images/user-icon.jpg';
        console.log(name, email, domain, pictureUrl, password)
        user = await authUtility.createNewUser(name, email, domain, pictureUrl, password);
        const jwtToken = await authUtility.createJWTToken(user);
        const userResponse = await authUtility.getUserResponse(user, jwtToken);
        res.status(201).json(userResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /auth/deleteUser/{username}:
 *  delete:
 *      summary: Deletes a user
 *      description: Delete a user
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: username
 *            description: The username to delete.
 *            schema:
 *              type: string
 *            required:
 *              - username
 *      responses:
 *          200:
 *              description: User deleted successfully.
 *          401:
 *              description: Unauthorized request.
 *          500:
 *              description: Internal server error.
 */
router.delete('/deleteUser/:username', async (req, res) => {
    try {
        const jwtToken = req.headers['authorization'].split(' ')[1];
        const user = await authUtility.getUserInfo(jwtToken);
        if (!user || user.username !== req.params.username) {
            return res.status(401).json({ error: 'Unauthorized request' });
        }
        await Model.deleteMany({ "author.username": user.username });
        await User.deleteOne({ username: user.username });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /auth/social-media-register:
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
 *              - email
 *            properties:
 *              email:
 *                  type: string
 *      responses:
 *          201:
 *              description: User registered successfully.
 *          500:
 *              description: error message (User already exists / Password and confirm password do not match). 
 */
router.post('/social-media-login', async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let config = await Config.findOne();
        if (!config.signin) {
            throw new Error('Login disabled');
        }

        const { name, accessToken, email, domain, pictureUrl } = req.body;
        let isVerified = await authUtility.verifySocialMediaToken(domain, accessToken);
        if (!isVerified) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        let user = await User.findOne({ email });
        if (!user) {
            const password = authUtility.generateRandomString(10);
            user = await authUtility.createNewUser(name, email, domain, pictureUrl, password);
        }
        const jwtToken = await authUtility.createJWTToken(user);
        const userResponse = await authUtility.getUserResponse(user, jwtToken);
        res.status(201).json(userResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
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
 *              - email
 *              - password
 *            properties:
 *              email:
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let config = await Config.findOne();
        if (!config.signin) {
            throw new Error('Login disabled');
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const jwtToken = await authUtility.createJWTToken(user);
        const userResponse = await authUtility.getUserResponse(user, jwtToken);
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/verify-token', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }
    try {
        jwt.verify(token, process.env.SECRET_KEY);
        //get user info
        res.status(200).json({ message: 'Valid Token' });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Unauthorized request' });
    }
});

/**
 * @swagger
 * /api/getUser:
 *  get:
 *      summary: Get User Info
 *      description: Retrieve user info.
 *      responses:
 *          200:
 *              description: Successful response with data.
 *          500:
 *              description: Internal server error.
 */
router.get('/getUser', async (req, res) => {
    try {
        const jwtToken = req.headers['authorization'].split(' ')[1];
        const user = await authUtility.getUserInfo(jwtToken);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized request' });
        }
        const resp = await authUtility.getUserResponse(user, jwtToken);
        res.status(200).json(resp);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
})

/**
 * @swagger
 * /api/updateUser:
 *  put:
 *      summary: Update User Info
 *      description: Update user info.
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: user
 *            description: The user to update.
 *            schema:
 *              type: object
 *            required:
 *              - name
 *              - email
 *              - institution
 *            properties:
 *              name:
 *                  type: string
 *              email:
 *                  type: string
 *              institution:
 *                  type: string
 *      responses:
 *          200:
 *              description: User updated successfully.
 *          401:
 *              description: Unauthorized request.
 *          500:
 *              description: Internal server error.
 */
router.put('/updateUser/:username', async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const jwtToken = req.headers['authorization'].split(' ')[1];
        const user = await authUtility.getUserInfo(jwtToken);
        if (!user || user.username !== req.params.username) {
            return res.status(401).json({ error: 'Unauthorized request' });
        }
        const { name, email, institution } = req.body;
        user.name = name;
        user.email = email;
        user.institution = institution;
        await user.save();
        const resp = await authUtility.getUserResponse(user, jwtToken);
        res.status(200).json(resp);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;