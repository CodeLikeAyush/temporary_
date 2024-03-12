require('dotenv').config()
const express = require("express");
const fs = require("fs");
const doctorRouter = express();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const rabbitmqconnection = require('../utils/rabbitmqconnection');

const doctorRegis = require("../database/models/doctorSchema");


doctorRouter.post('/doctorRegistration', async (req, res) => {
    try {

        const doctorPassword = await bcrypt.hash(req.body.doctorPassword, 10);
        const regdoctor = new doctorRegis({
            doctorName: req.body.doctorName,
            doctorEmail: req.body.doctorEmail,
            doctorGender: req.body.doctorGender,
            doctorPhone: req.body.doctorPhone,
            doctorId: req.body.doctorId,
            doctorPassword: doctorPassword,
            doctorSpecialization: req.body.doctorSpecialization
        })
        await regdoctor.save();

        const connection = await rabbitmqconnection.connect();
        const channel = await connection.createChannel();

        channel.sendToQueue(
            process.env.EXCHANGE_NAME,
            Buffer.from(
                JSON.stringify({
                    email:req.body.doctorEmail,
                    name: req.body.doctorName,
                    messege: "registration sucessful"
                })
            )
        );

        res.send("Doctor registered Sucessfully");
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})


doctorRouter.post('/doctorlogin', async (req, res) => {
    try {
        const email = req.body.doctorEmail;
        const password = req.body.doctorPassword;
        // console.log(email,password);
        let doctor = await doctorRegis.findOne({ doctorEmail: email });
        
        if (doctor === null) {
            res.status(200).send("Not found");
        }
        let isMatch = await bcrypt.compare(password, doctor.doctorPassword);
        
        if (isMatch) {
            const token = await jwt.sign({ emailToStore: doctor.doctorEmail, user: "doctor" }, process.env.SECRET_KEY, { expiresIn: 360000 });
            
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 3000000), httpOnIy: true
            });

            res.send("Logged in");
        }
        else {
            console.log("Password Doesn't Match");
            res.status(400).send("Invalid ");
        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

module.exports = doctorRouter