"use strict";

var express = require("express");
var exhand = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var slack = require("simple-slack-webhook");
var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
var path = require("path");

try {

    var app = express();
    var config = require("./config/config");
    var options = require("./routes/options");
    var auth = require("./routes/auth");

    if (config.database.credentials === undefined)
        throw new Error("No database credentials given");

    app.use(bodyParser.json());
    app.use(passport.initialize());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    app.use('/options', options);
    app.use('/auth/github/callback', auth);

    app.listen(process.env.PORT || 5000);

    mongoose.connect(config.database.credentials);
    var db = mongoose.connection;

    app.engine('hb', exhand({
        defaultLayout: 'index',
        extname: 'hb'
    }));
    app.set('view engine', 'hb');

    var ghOptions = {
        clientID: config.passport.GITHUB_CLIENT_ID,
        clientSecret: config.passport.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/github/callback"
    };

    var ghCallback = function(accessToken, refreshToken, profile, done) {
        done(null, {profile: profile, accessToken: accessToken});
    };

    passport.use(new GitHubStrategy(ghOptions, ghCallback));

    app.get("/", passport.authenticate('github'));

    app.get("/css/bootstrap.min.css", function(req, res) {
        res.sendFile(path.join(__dirname + "/css/bootstrap.min.css"));
    });
    app.get("/css/light-bootstrap-dashboard.css", function(req, res) {
        res.sendFile(path.join(__dirname + "/css/light-bootstrap-dashboard.css"));
    });

}

catch(error){
    console.log(error.message);
}