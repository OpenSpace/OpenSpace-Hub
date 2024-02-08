const { Seeder } = require('mongo-seeding');

const mongoose = require("mongoose")
const dotenv = require('dotenv')
const MONGODB_URL = process.env.MONGODB_URL

dotenv.config()

const mongo = async() => {
    try {
        const con  = await mongoose.connect(MONGODB_URL)
        console.log(`mongodb connected: ${con.connection.host}`)
    } catch (error) {
        console.error(error)
    }
}

module.exports = mongo