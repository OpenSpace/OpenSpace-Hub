// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('../uploads/firebase-admin/authentication-4b8de-firebase-adminsdk-drzj4-9c675a0419.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
