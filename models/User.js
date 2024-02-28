const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
// const userSchemaOld = new mongoose.Schema({
//     username: { type: String, unique: true, required: true },
//     password: { type: String, required: true }
// });

//name, {thumbnail pic, link, institution}, favorites

const userSchema = new mongoose.Schema({
    name: String,
    thumbnail: {
        type: String,
        default: __dirname + "/../images/user-icon.jpg"
    },
    link: String,
    institution: String,
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
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema)