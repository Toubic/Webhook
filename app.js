"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

try {

    var app = express();
    var config = require("./config/config");
    var dashboard = require("./routes/dashboard");
    var options = require("./routes/options");

    if (config.database.credentials === undefined)
        throw new Error("No database credentials given");

    app.use(bodyParser.json());

    app.use('/dashboard', dashboard);
    app.use('/options', options);

    app.listen(process.env.PORT || 5000);

    mongoose.connect(config.database.credentials);
    var db = mongoose.connection;

    app.get("/", function (req, res) {
        res.send("test");
    });

}

catch(error){
    console.log(error.message);
}