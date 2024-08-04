const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/books', stuffRoutes);

module.exports = app;
