require('dotenv').config()
const express = require("express");
const fs = require("fs");
const adminRouter = express();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const adminRegis = require("../database/models/adminSchema");

adminRouter.post('/adminRegistration', async (req, res) => {
    try {

        const adminPassword = await bcrypt.hash(req.body.adminPassword, 10);
        const regadmin = new adminRegis({
            adminName: req.body.adminName,
            adminEmail: req.body.adminEmail,
            adminPhone: req.body.adminPhone,
            adminPassword: adminPassword,
        })
        await regadmin.save();
        res.send("registered Sucessfully");
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})


adminRouter.post('/adminlogin', async (req, res) => {
    try {
        const email = req.body.adminEmail;
        const password = req.body.adminPassword;
        // console.log(email,password);
        let admin = await adminRegis.findOne({ adminEmail: email });
        
        if (admin === null) {
            res.status(200).send("Not found");
        }
        let isMatch = await bcrypt.compare(password, admin.adminPassword);
        
        if (isMatch) {
            const token = await jwt.sign({ emailToStore: admin.adminEmail, user: "admin" }, process.env.SECRET_KEY, { expiresIn: 360000 });
            
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

module.exports = adminRouter