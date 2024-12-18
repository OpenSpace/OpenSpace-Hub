const express = require('express');
const mongo = require('./config/mongo');
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;
const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });
const cors = require('cors');

const http = require('http');

function errorHandler(error, req, res, next) {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message
    }
  });
}

const uploadDir = 'uploads/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve the static files from the React app
app.use(express.static('frontend/build'));
app.use(express.static('frontend/public'));
app.use(express.static('uploads'));

app.use(express.json());
app.use(cors());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(errorHandler);

mongo();

app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});

http.createServer({}, app).listen(PORT, () => {
  console.log(`OpenSpace-Hub listening on port ${PORT}`);
});
