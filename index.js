const express = require('express')
const db = require('./config/db')
const mongo = require('./config/mongo')
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
mongo()

app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})