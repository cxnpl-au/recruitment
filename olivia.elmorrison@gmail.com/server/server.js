require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routers = require('./routes/index');

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
    // db.dropCollection('users')
    console.log('Connected to Database');
});

app.use(express.json());
app.use(routers);

app.listen(PORT, () => console.log(`Server Started on ${PORT}`))