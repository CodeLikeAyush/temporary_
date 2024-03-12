require('dotenv').config()
const express = require("express");
const fs = require("fs");
const studentRouter = express();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const rabbitmqconnection = require('../utils/rabbitmqconnection');

const studentRegis = require("../database/models/studentSchema");

studentRouter.post('/studentRegistration', async (req, res) => {
    try {

        const studentPassword = await bcrypt.hash(req.body.studentPassword, 10);
        const regstudent = new studentRegis({
            studentName: req.body.studentName,
            studentEmail: req.body.studentEmail,
            studentGender: req.body.studentGender,
            studentPhone: req.body.studentPhone,
            studentRollno: req.body.studentRollno,
            studentPassword: studentPassword,
            studentDepartment: req.body.studentDepartment,
        })
        await regstudent.save();

        const connection = await rabbitmqconnection.connect();
        const channel = await connection.createChannel();
        channel.sendToQueue(
            process.env.EXCHANGE_NAME,
            Buffer.from(
                JSON.stringify({
                    email:req.body.studentEmail,
                    name: req.body.studentName,
                    messege: "Registration Successful"
                })
            )
        );

        res.send("Registered Sucessfully");
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})


studentRouter.post('/studentlogin', async (req, res) => {
    try {
        const email = req.body.studentEmail;
        const password = req.body.studentPassword;
        // console.log(email,password);
        let student = await studentRegis.findOne({ studentEmail: email });
        
        if (student === null) {
            res.status(200).send("Not Found");
        }
        let isMatch = await bcrypt.compare(password, student.studentPassword);
        
        if (isMatch) {
            const token = await jwt.sign({ emailToStore: student.studentEmail, user: "student" }, process.env.SECRET_KEY, { expiresIn: 360000 });
            
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

module.exports = studentRouter