var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/opas");
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("connection succeeded");
});

var app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", 
//         "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

// department modules

app.post("/create-department",(req,res) => {

    console.log(req.body)

    let name = req.body.name;
    let desc = req.body.desc;
    let head = req.body.head;
    let budget = req.body.budget;
    let error = [];
    if(name == undefined){
        error.push("Name is required")
    }
    
    if(error.length < 1){
        var data = {
            name: name,
            description: desc,
            lead: head,
            budget: budget
        };

        db.collection("departments").insertOne(data, (err,collections) => {
            if (err) throw err;
            console.log("Record inserted Successfully");
        });

        return res.end(JSON.stringify({ status: "success" }));

    }else{
        return res.end(JSON.stringify({ status: "error", error: error }));
    }


})




// Authentication modules

app.post("/sign_up", function(req, res) {
    console.log(req.body);

    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.password;
    let phone = req.body.phone;

    let error = [];
    console.log(name, email, pass, phone);

    if (name == undefined) {
        error.push("Username is required");
    }
    if (email == undefined) {
        error.push("Email is required");
    }
    if (pass == undefined) {
        error.push("Password is required");
    }
    if (phone == undefined) {
        error.push("Phone is required");
    }

    if (error.length < 1) {
        var data = {
            name: name,
            email: email,
            password: pass,
            phone: phone
        };

        db.collection("profile").insertOne(data, function(err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully");
        });

        return res.end(JSON.stringify({ status: "success" }));
    } else {
        return res.end(JSON.stringify({ status: "error", error: error }));
    }
});


app.post("/login",(req,res) => {
    console.log(req.body);
    let email = req.body.email;
    let pass = req.body.password;

    let error = [];
    console.log(email, pass);

    if (email == undefined) {
        error.push("Email is required");
    }
    if (pass == undefined) {
        error.push("Password is required");
    }
   
    if (error.length < 1) {
        console.log(db.details)
        return res.end(JSON.stringify({ status: "success"}));
    } else {
        return res.end(JSON.stringify({ status: "error", error: error }));
    }
});

app.get("/", function(req, res) {
    res.set({
        "Access-control-Allow-Origin": "*"
    });
    return res.redirect("index.html");
}).listen(3000);

console.log("server listening at port 3000");
