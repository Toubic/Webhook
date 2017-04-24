"use strict";

var express = require("express");
var router = express.Router();
var passport = require("passport");
var orgs = require("github-user-orgs");
var GitHub = require("octocat");

router.get("/",
    passport.authenticate('github', { failureRedirect: 'https://github.com/' }),
    function(req, res) {
        var client = new GitHub({
            token: req.user.accessToken
        });
        client.post('/orgs/exam2/hooks', {
            "name": "web",
            "active": true,
            "events": [
                "push",
                "pull_request"
            ],
            "config": {
                "url": "http://example.com/webhook",
                "content_type": "json"
            }
        });
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
