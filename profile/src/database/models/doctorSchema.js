// doctor Schema
const mongoose= require("mongoose");

const doctorSchema =new mongoose.Schema({
  doctorId:{
      type: String,
      required: true
  },
  doctorName:{
      type: String,
      required:true
  },
  doctorEmail:{
      type: String,
      required:true
  },
  doctorGender:{
      type: String,
      required: true
  },
  doctorPhone:{
      type: Number,
      required: true,
      unique:true
  },
  doctorPassword :{
    type: String,
    required: true
  },
  doctorSpecialization :{
    type: String,
    required: true
  }
})

// now we need to create a collection
const doctorReg= new mongoose.model("doctorreg",doctorSchema);
module.exports=doctorReg;

