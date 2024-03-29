const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authUtility = require('./../utils/authUtility')


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
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }
    try {
        jwt.verify(token, process.env.SECRET_KEY);
        //get user info
        console.log(jwt.decode(token, process.env.SECRET_KEY));
        res.status(200).json({ message: 'Token verified successfully' });
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
        const resp = await authUtility.getUserResponse(user, jwtToken);
        res.status(200).json(resp);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;