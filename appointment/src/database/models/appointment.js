// 7 daye ( a week ) dynamix table
// doctor Schema
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    doctorSpecialization: {
        type: String,
        required: true
    },
    slotsNumber: {
        type: String
    },
    studentId: {
        type: String
    }
})

// now we need to create a collection
const appointments = new mongoose.model("appointment", appointmentSchema);
module.exports = appointments;

