"use strict";

var express = require("express");
var exhand = require("express-handlebars");
var bodyParser = require("body-parser");
var passport = require("passport");
var GitHubStrategy = require("passport-github2").Strategy;
var octonode = require("octonode");
var path = require("path");

try {

    var app = express();
    app.listen(process.env.PORT || 5000);

    var config = require("./config/config");
    var options = require("./routes/options");
    var auth = require("./routes/auth");

    app.use(bodyParser.json());
    app.use(passport.initialize());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    app.use('/options', options);
    app.use('/auth/github', auth);

    app.engine('hb', exhand({
        defaultLayout: 'index',
        extname: 'hb'
    }));
    app.set('view engine', 'hb');

    // OAuth application config:

    var ghOptions = {
        clientID: config.passport.GITHUB_CLIENT_ID,
        clientSecret: config.passport.GITHUB_CLIENT_SECRET,
        callbackURL: "https://shrouded-hamlet-39019.herokuapp.com/auth/github/callback"
    };

    var ghCallback = function(accessToken, refreshToken, profile, done) {
        done(null, {profile: profile, accessToken: accessToken});
    };

    passport.use(new GitHubStrategy(ghOptions, ghCallback));

    app.get("/", passport.authenticate('github', { scope: [ 'admin:org_hook' ] }));

    app.get("/css/bootstrap.min.css", function(req, res) {
        res.sendFile(path.join(__dirname + "/css/bootstrap.min.css"));
    });
    app.get("/css/light-bootstrap-dashboard.css", function(req, res) {
        res.sendFile(path.join(__dirname + "/css/light-bootstrap-dashboard.css"));
    });

    app.get("/js/Chart.min.js", function(req, res) {
        res.sendFile(path.join(__dirname + "/js/Chart.min.js"));
    });

}

catch(error){
    console.log(error.message);
}