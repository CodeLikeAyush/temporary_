// Get slots details on doctor dashboard or student dashboard
require('dotenv').config()
// import { UserAuth, AdminAuth } from './middlewares/auth';
const { UserAuth, AdminAuth } = require("./middlewares/auth");
const express = require("express");
const slotsRouter = express();
const slotsSchema = require("../database/models/slots");

// admin puts slot
/*
 req.body = {
    date : type Date,
    generalDoctors : [{doctorId : String, doctorName : String}],
    specialDoctors : [{doctorId : String, doctorName : String}],
 }
*/
slotsRouter.post('/createSlots', AdminAuth, async (req, res) => {
    try {

        // res.send(req.body);

        const input = {
            date: req.body.date,
            doctors: []
        }
        for (const doctor of req.body.generalDoctors) {
            input.doctors.push({
                doctorId: doctor.doctorId,
                doctorName: doctor.doctorName,
                doctorSpecialization: "general",
                doctorSlots: {
                    "slot1": 0,
                    "slot2": 0,
                    "slot3": 0,
                    "slot4": 0,
                    "slot5": 0,
                    "slot6": 0
                }
            })
        }
        for (const doctor of req.body.specialDoctors) {
            input.doctors.push({
                doctorId: doctor.doctorId,
                doctorName: doctor.doctorName,
                doctorSpecialization: doctor.doctorSpecialization,
                doctorSlots: {
                    "slot1": 0,
                    "slot2": 0,
                    "slot3": 0,
                    "slot4": 0,
                    "slot5": 0,
                    "slot6": 0
                }
            })
        }
        const newSlots = new slotsSchema(input);
        await newSlots.save();
        console.log(`new slots for ${input.date} has been created`);
        res.send(`New Slots Created Successfully for Date : ${input.date}`);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

// get by date (for student or doctor)
slotsRouter.get('/getSlots/:date', UserAuth, async (req, res) => {
    try {
        const date = new Date(req.params.date);
        slotsSchema.find({ date: date }, { _id: 0 }, (err, result) => {
            if (err) {
                console.log(error);
                res.status(400).send(error);
            }
            else {
                res.json({ slotResult: result });
            }
        });
    } catch (error) {
        console.log(error);
    }
})

// post by student (slot selection and booking) => in appointment routes....

module.exports = slotsRouter