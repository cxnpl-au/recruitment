const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
const userPermissionRoute = require('./routes/permissions');
const resourceRoute = require('./routes/resource');


dotenv.config();

//Connect to DB
mongoose 
 .connect(process.env.LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/permission', userPermissionRoute);
app.use('/api/resource', resourceRoute);

app.listen(8080, () => console.log('Server Started'));

