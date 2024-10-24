const express = require('express')
const mongo = require('./config/mongo')
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const app = express()
const secureApp = express();
const PORT = process.env.PORT || 80
const SECUREPORT = process.env.PORT || 443
const accessLogStream = fs.createWriteStream(path.join(__dirname,
  'access.log'), { flags: 'a' });
const cors = require("cors");

const http = require('http');
// const https = require('https');

// const keyCertDir = path.join(__dirname, 'uploads', 'certs', 'server.key');
// const certCertDir = path.join(__dirname, 'uploads', 'certs', 'server.crt');
const options = {
  // key: fs.readFileSync(keyCertDir),
  // cert: fs.readFileSync(certCertDir)
};


function errorHandler(error, req, res, next) {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message,
    },
  });
}

const uploadDir = path.join(__dirname, 'uploads', 'images');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(express.static(path.join(__dirname, 'frontend/public')));
app.use(express.static(path.join(__dirname, 'uploads')));


secureApp.use(express.static(path.join(__dirname, 'frontend/build')));
secureApp.use(express.static(path.join(__dirname, 'frontend/public')));
secureApp.use(express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(cors());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(errorHandler);

secureApp.use(express.json());
secureApp.use(cors());
secureApp.use(morgan('combined', { stream: accessLogStream }));
secureApp.use(errorHandler);
mongo()

app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

secureApp.use('/api', routes);
secureApp.use('/auth', authRoutes);
secureApp.use('/protected', protectedRoute);
secureApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
});

secureApp.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
});

// Unsecure server
http.createServer(options, app).listen(PORT, () => {
  console.log(`OpenSpace-Hub listening on port ${PORT}`);
});

// Secure server
// https.createServer(options, secureApp).listen(SECUREPORT, () => {
//   console.log(`OpenSpace-Hub secure listening on port ${SECUREPORT}`);
// });
