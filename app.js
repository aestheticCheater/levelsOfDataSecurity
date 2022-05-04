
//jshint esversion:6
require('dotenv').config(); // level 3 security. environment variables
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
console.log(process.env.API_KEY);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");
// data encryption - level 2 security of server
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);




app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});


app.post("/register", function(req,res){
const newUser = new User({
  email: req.body.username,
  password: req.body.password
});

newUser.save(function(err){
  if(!err){
    res.render("secrets");
  }
  else{
    console.log(err);
  }
});
});
// first level of security - authentication form and store user info in database

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;


  User.findOne({emal: username}, function (err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser) {
        if(foundUser.password === password){
          res.render("secrets");
        }

      }
    }
  })
})



app.listen(3000, function(){
  console.log("Server started at port 3000.");
});
