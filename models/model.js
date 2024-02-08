const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    type: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    image: {
        required: true,
        type: String
    },
    date_added: {
        required: true,
        type: String
    },
    date_modified: {
        required: true,
        type: String
    }
})

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    }
});

const downloadSchema = new mongoose.Schema({
    '0.19.0': {
        type: String,
        required: true
    },
    '0.18.0': {
        type: String,
        required: true
    },
    '0.17.1': {
        type: String,
        required: true
    }
});

const dataSchema2 = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: authorSchema,
        required: true
    },
    version: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    download: {
        type: downloadSchema,
        required: true
    },
    date_added: {
        type: String,
        required: true
    },
    date_modified: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('hubitems', dataSchema)