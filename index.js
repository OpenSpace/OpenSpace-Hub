const express = require('express')
const db = require('./config/db')
const mongo = require('./config/mongo')
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
// const fileupload = require("express-fileupload");
// const multer = require('multer');

const app = express()
const PORT = process.env.PORT || 9000
const accessLogStream = fs.createWriteStream(path.join(__dirname,
  'access.log'), { flags: 'a' });
const cors = require("cors");



function errorHandler(error, req, res, next) {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message,
    },
  });
}

app.use(express.json());
app.use(cors());
app.use(morgan('combined', { stream: accessLogStream }));
// app.use(fileupload());
app.use(errorHandler);
mongo()

app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  console.log(`OpenSpace-Hub listening on port ${PORT}`)
})