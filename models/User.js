const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: "defaults/images/user-icon.jpg"
    },
    domain: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: "www.example.com",
        required: true
    },
    institution: {
        type: String,
        default: "OpenSpace",
        required: true
    },
    role: {
        type: String,
        default: "user",
        required: true
    },
    created: {
        type: String,
        required: true
    },
    modified: {
        type: String,
        required: true
    },
    favorites: {
        type: [ObjectId]
    },
});

module.exports = mongoose.model('User', userSchema)