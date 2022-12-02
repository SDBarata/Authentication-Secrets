//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const md5 = require('md5');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

console.log(md5("qwerty"));
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect("mongodb://localhost:27017/userDB")
};

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.post("/register", (req, res) =>{
    console.log(req.body)
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        } else {
            console.log(err);
        }
    });
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if (foundUser.password === password){
                res.render("secrets");
                }
            }
            
        }
    });
});

app.listen(3000, (req, res) => {
    console.log("The server is running on 3000 port.")
});