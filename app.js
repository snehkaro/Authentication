require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt=require("mongoose-encryption")

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
console.log("****************************");
console.log(process.env.API_KEY);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const schema=new mongoose.Schema({
  email:{type:String, 
        required: [true , "Email field should not be empty"]},
  pwd:{type:String,
       required:[true,"Password fiels cannot be empty"] }
});


schema.plugin(encrypt, { secret: process.env.Secret ,encryptedFields: ["pwd"]});


const userModel=mongoose.model("userAuthentication",schema);



app.get("/", function(req,res){
res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
   console.log(req.body.username);
  console.log(req.body.password);

userModel.create({email:req.body.username,pwd:req.body.password})
.then(function(){
  console.log("Inserted");
  
  res.render("secrets");
})
.catch((err) => console.log(err));

});


app.post("/login",function(req,res){
  console.log(req.body.username);
  console.log(req.body.password);

  userModel.findOne({email:req.body.username})
  .then(function(record){
    console.log(record.pwd);
    if(record.pwd===req.body.password){
console.log("REcord found");
res.render("secrets");
    }else{
console.log("REcord not found");
res.render("home");
    }
  })

.catch((err) =>console.log(err))


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});