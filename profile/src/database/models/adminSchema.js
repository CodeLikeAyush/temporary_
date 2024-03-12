// admin Schema
const mongoose= require("mongoose");

const adminSchema =new mongoose.Schema({
  adminName:{
      type: String,
      required:true
  },
  adminEmail:{
      type: String,
      required:true
  },
  adminPhone:{
      type: Number,
      required: true,
      unique:true
  },
  adminPassword :{
    type: String,
    required: true
  }
})

// now we need to create a collection
const adminReg= new mongoose.model("adminreg",adminSchema);
module.exports=adminReg;

