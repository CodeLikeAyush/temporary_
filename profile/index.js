require('dotenv').config()
const express = require("express");
const fs = require("fs");
const app = express();
const cookieParser = require('cookie-parser');


// middleware
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded());

const port = process.env.PORT || 8001;

const connectDB = require("./src/database/connection");
connectDB();

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files


// routes
const studentrouter=require('./src/api/student');
app.use(studentrouter);

const doctorRouter=require('./src/api/doctor');
app.use(doctorRouter);

const adminrouter=require('./src/api/admin');
app.use(adminrouter);


// ENDPOINTS
app.get('/', (req, res) => {
      res.send('Hello From Profile Page');
})

app.get('/new', (req, res) => {
      res.send('Hello From new Profile Page');
})

// starting the server
app.listen(port, () => {
      console.log(`the app started sucessfully on port ${port}`);
})