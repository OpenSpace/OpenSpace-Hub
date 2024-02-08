const dotenv = require('dotenv')
const { Seeder } = require('mongo-seeding');
dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL

const seed = async () => {
    try {
        const path = require('path');
        const seeder = new Seeder({
            database: MONGODB_URL,
            dropDatabase: true,
        });
        console.log(`mongodb connected: ${seeder.connection.host}`)
        const collections = seeder.readCollectionsFromPath(
            path.resolve('./../data'),
        );
        await seeder.import(collections);

        console.log("data imported successfully");
    } catch (error) {
        console.error(error)
    }
}
seed();