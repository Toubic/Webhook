"use strict";

var express = require("express");
var router = express.Router();
var passport = require("passport");
var orgs = require( 'github-user-orgs' );

router.get("/",
    passport.authenticate('github', { failureRedirect: 'https://github.com/' }),
    function(req, res) {

        var opts = {
            "username": req.user.profile.username
        };

        orgs(opts, clbk);

        function clbk(err, results, info) {
            if (info) {
                console.error(info);
            }
            if (err) {
                throw new Error(err.message);
            }
            res.render('dashboard',{profile: req.user.profile.username, organizations: results});
        }

    }
);

module.exports = router;
