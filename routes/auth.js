"use strict";

var express = require("express");
var router = express.Router();
var passport = require("passport");

router.get("/",
    passport.authenticate('github', { failureRedirect: 'https://github.com/' }),
    function(req, res) {
        console.log(req.user);
        res.render('dashboard',{profile: req.user});
    }
);

module.exports = router;
