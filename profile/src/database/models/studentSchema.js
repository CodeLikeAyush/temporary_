// student Schema
const mongoose= require("mongoose");

const studentSchema =new mongoose.Schema({
  studentRollno:{
      type: String,
      required: true
  },
  studentName:{
      type: String,
      required:true
  },
  studentEmail:{
      type: String,
      required:true
  },
  studentGender:{
      type: String,
      required: true
  },
  studentPhone:{
      type: Number,
      required: true,
      unique:true
  },
  studentPassword :{
    type: String,
    required: true
  },
  studentDepartment :{
    type: String,
    required: true
  }
})

// now we need to create a collection
const studentReg= new mongoose.model("studentreg",studentSchema);
module.exports=studentReg;

