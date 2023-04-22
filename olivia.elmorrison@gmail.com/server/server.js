require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const userRouter = require('./routes/UserRoutes');
app.use('/users', userRouter)


app.listen(PORT, () => console.log(`Server Started on ${PORT}`))