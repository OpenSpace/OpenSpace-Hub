const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { getFormattedDate } = require('./utility');

exports.generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

exports.generateUsername = async (email) => {
  let username = email.split('@')[0];
  // remove special characters and replace spaces with underscore
  username = username.replace(/[^a-zA-Z0-9]/g, '-');

  // check if username already exists
  let user = await User.findOne({ username });
  if (user) {
    const randomString = this.generateRandomString(5);
    username = `${username}-${randomString}`;
  }
  return username;
};

exports.verifyGoogleToken = async (accessToken) => {
  try {
    await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.verifyFacebookToken = async (accessToken) => {
  try {
    await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}`);
    return true;
  } catch (error) {
    console.log(error.response.data.error.message);
    return false;
  }
};

exports.getHashedPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
exports.createNewUser = async (user) => {
  try {
    const newUser = new User({
      name: user.name,
      email: user.email,
      username: await this.generateUsername(user.email),
      thumbnail: user.picture ? user.picture : null,
      created: getFormattedDate(new Date()),
      modified: getFormattedDate(new Date()),
      role: 'user'
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.getUserResponse = async (user) => {
  try {
    return {
      name: user.name,
      email: user.email,
      username: user.username,
      thumbnail: user.thumbnail,
      link: user.link,
      institution: user.institution,
      favorites: user.favorites,
      role: user.role
    };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.getUserInfo = async (user) => {
  const userInfo = await User.findOne({ email: user.email });
  return userInfo;
};
