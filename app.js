"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

try {

    var app = express();

    if (config.database.credentials === undefined)
        throw new Error("No database credentials given");

    app.use(bodyParser.json());

    app.listen(process.env.PORT || 5000);

    mongoose.connect(config.database.credentials);
    var db = mongoose.connection;

    app.get("/", function (req, res) {

    });

}

catch(error){
    console.log(error.message);
}