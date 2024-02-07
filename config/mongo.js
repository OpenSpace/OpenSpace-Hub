const { Seeder } = require('mongo-seeding');
const config = {
    database: {
      host: '127.0.0.1',
      port: 27017,
      name: 'openspacehub',
    },
    dropDatabase: true,
  };

const seeder = new Seeder(config);

const path = require('path');
const collections = seeder.readCollectionsFromPath(
  path.resolve('./../data'),
);

const mongo = async() => {
    try {
        await seeder.import(collections);
        console.log("data imported successfully")
    } catch (err) {
        // Handle errors
    }
}

module.exports = mongo