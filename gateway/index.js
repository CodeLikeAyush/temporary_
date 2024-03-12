const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/profile", proxy("http://localhost:8001"));
app.use("/appointment", proxy("http://localhost:8002"));
app.use("/inventory", proxy("http://localhost:8003")); 
app.use("/healthrecord", proxy("http://localhost:8004")); 
app.use("/notification", proxy("http://localhost:8005")); 

app.get('/',(req,res)=>{
  res.send("Hello ");
});

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});
