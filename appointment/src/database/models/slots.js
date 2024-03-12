// slots Schema

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
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
    doctorSlots: {
        type: Object, "default": {}
    }
});

const slotSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    doctors:{
        type: [doctorSchema],
        required: true

    }
})

// now we need to create a collection
const slots = new mongoose.model("slotSchema", slotSchema);
module.exports = slots;