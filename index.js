const express = require('express')
const dotenv = require("dotenv")
const db = require('./config/db')
// const hubitemRoutes = require('./services/hubItems/hubItems.routes')
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');

const mongoose = require('mongoose');

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());

db()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', routes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
// app.use('/api/hubitems', hubitemRoutes)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})