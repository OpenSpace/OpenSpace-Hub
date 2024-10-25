const express = require('express');
const router = express.Router();
const Config = require('./../models/Config');
const User = require('./../models/User');
const Model = require('../models/Model');
const authUtility = require('./../utils/authUtility');
const { validationResult } = require('express-validator');
const verifyToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /auth/deleteUser/{username}:
 *  delete:
 *    summary: Deletes a user
 *    description: Delete a user
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: username
 *        description: The username to delete.
 *        schema:
 *          type: string
 *        required:
 *          - username
 *    responses:
 *      200:
 *        description: User deleted successfully.
 *      401:
 *        description: Unauthorized request.
 *      500:
 *        description: Internal server error.
 */
router.delete('/deleteUser/:username', verifyToken, async (req, res) => {
  try {
    const user = await authUtility.getUserInfo(req.user);
    if (!user || user.username !== req.params.username) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }
    await Model.deleteMany({ 'author.username': user.username });
    await User.deleteOne({ username: user.username });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /auth/social-media-register:
 *  post:
 *    summary: Creates a new user
 *    description: Register a new user
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *          type: object
 *        required:
 *          - email
 *        properties:
 *          email:
 *            type: string
 *    responses:
 *      201:
 *        description: User registered successfully.
 *      500:
 *        description: error message (User already exists / Password and confirm password do not match).
 */
router.post('/social-media-login', verifyToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let config = await Config.findOne();
    if (!config.signin) {
      throw new Error('Login disabled');
    }

    let user = await User.findOne({ email: req.user.email });
    console.log('social-media-login: ', user);
    if (!user) {
      console.log('new social-media-login: ', req.user);
      user = await authUtility.createNewUser(req.user);
    }
    const userResponse = await authUtility.getUserResponse(user);
    res.status(201).json(userResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-token', verifyToken, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
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
 *    summary: Get User Info
 *    description: Retrieve user info.
 *    responses:
 *      200:
 *        description: Successful response with data.
 *      500:
 *        description: Internal server error.
 */
router.get('/getUser', verifyToken, async (req, res) => {
  try {
    const user = await authUtility.getUserInfo(req.user);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }
    const resp = await authUtility.getUserResponse(user);
    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/updateUser:
 *  put:
 *    summary: Update User Info
 *    description: Update user info.
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to update.
 *        schema:
 *          type: object
 *        required:
 *          - name
 *          - email
 *          - institution
 *        properties:
 *          name:
 *              type: string
 *          email:
 *              type: string
 *          institution:
 *              type: string
 *    responses:
 *      200:
 *        description: User updated successfully.
 *      401:
 *        description: Unauthorized request.
 *      500:
 *        description: Internal server error.
 */
router.put('/updateUser/:username', verifyToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await authUtility.getUserInfo(req.user);
    if (!user || user.username !== req.params.username) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }
    const { name, email, institution } = req.body;
    user.name = name;
    user.email = email;
    user.institution = institution;
    await user.save();
    const resp = await authUtility.getUserResponse(user);
    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
