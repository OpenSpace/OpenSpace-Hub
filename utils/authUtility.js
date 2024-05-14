const jwt = require('jsonwebtoken')
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
}

exports.generateUsername = async (email) => {
    let username = email.split('@')[0];
    //remove special characters and replace spaces with underscore
    username = username.replace(/[^a-zA-Z0-9]/g, '-');

    //check if username already exists
    let user = await User.findOne( {username} );
    if (user) {
        const randomString = this.generateRandomString(5);
        username = `${username}-${randomString}`;
    }
    return username;
}

exports.verifyGoogleToken = async(accessToken) => {
    try {
        await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json'
            }
          }
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
}

exports.verifyFacebookToken = async(accessToken) => {
    try {
        await axios.get(
          `https://graph.facebook.com/me?access_token=${accessToken}`
        );
        return true;
      } catch (error) {
        console.log(error.response.data.error.message);
        return false;
      }
}

exports.getHashedPassword = async(password) => {
    try{
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}
exports.createNewUser = async (name, email, domain, pictureUrl, password) => {
    try{
        const newUser = new User({ 
            name: name,
            email: email,
            username: await this.generateUsername(email),
            password: await this.getHashedPassword(password),
            thumbnail: pictureUrl ? pictureUrl : null,
            domain: domain,
            created: getFormattedDate(new Date()),
            modified: getFormattedDate(new Date()),
            role: 'user',
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

exports.verifySocialMediaToken = async(domain, accessToken) => {
    let isVerified = false;
    switch (domain) {
        case 'google':
            isVerified = this.verifyGoogleToken(accessToken);
            break;
        case 'facebook':
            isVerified = this.verifyFacebookToken(accessToken);
            break;
        default:
            throw new Error('Invalid domain');
    }
    return isVerified;
}

exports.createJWTToken = async (user) => {
    try{
        const token = jwt.sign( {userId : user._id }, process.env.SECRET_KEY, { expiresIn: '1h', });
        return token;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

exports.validatePassword = (password, cnfPassword) => {
    if (password !== cnfPassword) {
        throw new Error('Password and confirm password do not match');
    }
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
    if (!password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/[0-9]/)) {
        throw new Error('Password must contain at least one lowercase letter, one uppercase letter, and one number');
    }
}

exports.getUserResponse = async(user, jwtToken) => {
    try{
        return {
            name: user.name,
            email: user.email,
            username: user.username,
            token: jwtToken,
            thumbnail: user.thumbnail,
            domain: user.domain,
            link: user.link,
            institution: user.institution,
            favorites: user.favorites,
            role: user.role,
        }
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

exports.getUserInfo = async(jwtToken) => {
    const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY)
    const user = await User.findById(decoded.userId);
    return user;
}
