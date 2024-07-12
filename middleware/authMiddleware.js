const admin = require('../config/firebaseAdmin');

const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized');
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("verifyToken: decodedToken: ", decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error)
    res.status(401).send('Unauthorized');
  }
};

module.exports = verifyToken;