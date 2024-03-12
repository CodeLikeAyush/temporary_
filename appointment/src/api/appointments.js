// to book appointments
// Get slots details on doctor dashboard or student dashboard
require('dotenv').config()
// import { UserAuth } from './middlewares/auth';
const { UserAuth } = require("./middlewares/auth");
const express = require("express");
const appointmentRouter = express();
const appointmentSchema = require("../database/models/appointment");
const slotsSchema = require("../database/models/slots");

const amqp = require("amqplib");

var channel;
connect = async () => {
    try {
      const connection = await amqp.connect(process.env.MSG_QUEUE_URL);
      channel = await connection.createChannel();
    //   await channel.assertQueue(process.env.EXCHANGE_NAME, { durable: true });
    } catch (err) {
      console.log(err);
    }
};
connect();

// Post request to book appointment
/*
 req.body = {
    date: Date,
    studentId: String,
    doctorId: String,
    slot: Number,
 }
*/
// updating slot array in slotSchema and creating appointment
appointmentRouter.post('/bookAppointment', UserAuth, async (req, res) => {
    try {
        const date = req.body.date;
        let Inputslot = req.body.slot;
        
        appointmentSchema.findOne({
            date:req.body.date,studentId:req.body.studentId,doctorId:req.body.doctorId
        },async(err,studentexist)=>{
            if(err){
                res.send(error);
            }else
            if(studentexist==null){
                slotsSchema.findOne(
                    { date: date }, // Filter by date
                    {
                        doctors: {
                            $elemMatch: { doctorId: req.body.doctorId } // Filter by doctor ID within the date-matched document
                        }
                    }, async (err, SlotDetails) => {
                        if (err) {
                            console.log(err);
                            res.status(400).send(err);
                        } else {
                            const slotCounts = SlotDetails.doctors[0].doctorSlots;
        
                            if (slotCounts[Inputslot] == 5) {
                                res.send("Slot Full");
                            } else {
                                slotCounts[Inputslot] += 1;
                                await slotsSchema.updateOne(
                                    {
                                        date: date, // Filter by date
        
                                        "doctors.doctorId": req.body.doctorId  // Filter by doctor ID within the date-matched document
        
                                    },
                                    {
                                        $set: { 'doctors.$.doctorSlots': slotCounts }
                                    },
                                    {
                                        new: true
                                    }, async (err, updatedData) => {
        
                                        const doctordetails= SlotDetails.doctors[0];
        
                                        const newAppointmet = new appointmentSchema({
                                            date : date,
                                            studentId : req.body.studentId,
                                            doctorId : doctordetails.doctorId,
                                            doctorName : doctordetails.doctorName,
                                            doctorSpecialization : doctordetails.doctorSpecialization,
                                            slotsNumber : req.body.slot
                                        });
                                    
                                        await newAppointmet.save();

                                        channel.sendToQueue(
                                            process.env.EXCHANGE_NAME,
                                            Buffer.from(
                                                JSON.stringify({
                                                    studentEmail:req.body.studentEmail,
                                                    messege: "Appointment sucessful",
                                                    date:req.body.date,
                                                    studentId:req.body.studentId,
                                                    doctorId:req.body.doctorId,
                                                    doctorName: doctordetails.doctorName,
                                                    doctorSpecialization : doctordetails.doctorSpecialization,
                                                    slotsNumber : req.body.slot
                                                })
                                            )
                                        );
        
                                        res.send("Appointment Done Successfully");
                                    }
        
                                );
                            }
                        }
        
                    });
            }else{
                res.send("You have already took Appointment with same Doctors on this given date");
            }
        })

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

// get by date and doctorId
/*
    req : http://localhost:...../getAppointment/date?doctorId=87988009
*/
appointmentRouter.get('/getAppointment/:date', UserAuth, async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const doctorId = req.query.doctorId;
        const doctorSlotResult = await slotsSchema.find({ date: date, 'doctors.doctorId': doctorId }, { _id: 0 });
        res.json({ doctorSlotResult: doctorSlotResult });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

module.exports = appointmentRouter

// conditionl get (based on requirement)