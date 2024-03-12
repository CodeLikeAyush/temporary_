require('dotenv').config()
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const amqp = require("amqplib");

app.use(express.json());

const port = process.env.PORT || 8005;

// Nodemailor Transporter

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "nitkhcc7@gmail.com",
      pass: "ebxa uhxv ahgh eqnu",
    },
  });

//ebxa uhxv ahgh eqnu

// Rabbit Mq Stuffs
var channel, connection;
connect = async () => {
    try {
        connection = await amqp.connect(process.env.MSG_QUEUE_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(process.env.EXCHANGE_NAME, { durable: true });
        await channel.assertQueue(process.env.EXCHANGE_NAME2, { durable: true });
        //   return channel;
    } catch (err) {
        console.log(err);
    }
};
connect().then(async () => {
    await channel.consume("Profile-Notification", (data) => {
        console.log("Profile-Notification");
        const { email, name, messege } = JSON.parse(data.content);
        // console.log(JSON.parse(data.content));

        // Node mailer
        var mailOptions = {
            from: 'nitkhcc7@gmail.com',
            to: email,
            subject: `NITK DIGITAL HCC Registration Successfully`,
            text: `Dear ${name}, \n You have Registered Successfully to NITK Digitial HCC Portal. Kindly Login with your credentials to book appointment.`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        channel.ack(data);

    });

    // consuming Appointment Notification

    await channel.consume("Appointment-Notification", (data) => {
        console.log("Appointment-Notification");

        const { studentEmail, messege, date,studentId,doctorId,doctorName,doctorSpecialization,slotsNumber } = JSON.parse(data.content);
        // console.log(JSON.parse(data.content));

        // Node mailer
        var mailOptions = {
            from: 'nitkhcc7@gmail.com',
            to: studentEmail,
            subject: `Appointment Done Sucessfully`,
            text: `Dear ${studentId},\n Your Appointment has been Sucessfully booked to NITK DIgitial HCC Portal.\nBelow are the Appointment Details:\nDoctor Name: ${doctorName}\nDoctor Id: ${doctorId}\nDoctor Specialization: ${doctorSpecialization}\nSlot No: ${slotsNumber}\nDate: ${date}.`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        channel.ack(data);

    });
});


app.use('/', (req, res, next) => {

    return res.status(200).json({ "msg": "Hello from Notification" })
})

app.listen(8005, () => {
    console.log('Notification is Listening to Port 8005')
})