"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var slack = require("simple-slack-webhook");
var exhand = require("express-handlebars");

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

    app.engine('hb', exhand({
        defaultLayout: 'index',
        extname: 'hb'
    }));
    app.set('view engine', 'hb');

    app.get("/", function (req, res) {
        res.render('options');
    });

}

catch(error){
    console.log(error.message);
}