"use strict";

var express = require("express");
var router = express.Router();
var passport = require("passport");
var octonode = require("octonode");

router.get("/",
    passport.authenticate('github', { failureRedirect: 'https://github.com/' }),
    function(req, res) {

        var client = octonode.client(req.user.accessToken);

        function organizationsToDatabase(username) {

            client.get('/users/'+ username +'/orgs', {}, function (err, status, body, headers) {

                body.forEach(function(organization) {
                    console.log(organization.login); //Save to database
                });

            });
        }

        function repositoriesToDatabase(organization) {

            client.get('/orgs/' + organization + '/repos', {}, function (err, status, body, headers) {
                body.forEach(function(repository) {
                    console.log(repository.name); //Save to database
                });
            });
        }

        function commitsToDatabase(organization, repository) {

            client.get('/repos/' + organization + '/' + repository + '/commits', {}, function (err, status, body, headers) {

                body.forEach(function(commit) {
                    console.log(commit.author.login + ": " + commit.commit.message); //Save to database
                });
            });
        }

        function releasesToDatabase(organization, repository) {

            client.get('/repos/' + organization + '/' + repository + '/releases', {}, function (err, status, body, headers) {

                body.forEach(function(release) {
                    console.log(release.author.login + ": " + release.tag_name + " - " + release.name + " - " + release.body); //Save to database
                });
            });
        }

        organizationsToDatabase(req.user.profile.username);
        repositoriesToDatabase("exam2");
        commitsToDatabase("exam2", "test");
        releasesToDatabase("exam2", "test");
        res.render('dashboard',{profile: req.user.profile.username});

    }
);

module.exports = router;
