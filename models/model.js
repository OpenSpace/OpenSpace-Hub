const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: String,
    link: String,
    institution: String,
});

const versionSchema = new mongoose.Schema({
    version: String,
    url: String,
});

const archiveSchema = new mongoose.Schema({
    version: String,
    url: String,
});

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['asset', 'profile', 'recording', 'www', 'video'] // add other types if required
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: authorSchema,
        // required: true
    },
    currentVersion: {
        type: versionSchema,
        // required: true
    },
    image: {
        type: String,
        required: true
    },
    archives: {
        type: [archiveSchema],
        // required: true
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
        type: [ObjectId],
        // required: true
    }
});

module.exports = mongoose.model('hubitems', dataSchema)