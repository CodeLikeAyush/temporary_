require('dotenv').config()
const express = require("express");
const fs = require("fs");
const app = express();
const cookieParser = require('cookie-parser');

// middleware
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded());

const port = process.env.PORT || 8002;

const connectDB = require("./src/database/connection");

connectDB();

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files

const slotsRouter=require('./src/api/slotmanagement');
app.use(slotsRouter);

const appointmentRouter=require('./src/api/appointments');
app.use(appointmentRouter);


app.use('/', (req,res,next) => {
    return res.status(200).send("Hello from appointment");
})

app.listen(port, () => {
    console.log(`Appointment is Listening to Port ${port}`);
})