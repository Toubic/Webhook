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
                    repositoriesToDatabase(organization.login);
                });

            });
        }

        function repositoriesToDatabase(organization) {

            client.get('/orgs/' + organization + '/repos', {}, function (err, status, body, headers) {
                body.forEach(function(repository) {

                    commitsToDatabase(organization, repository.name);
                    releasesToDatabase(organization, repository.name);
                });
            });
        }

        function commitsToDatabase(organization, repository) {

            client.get('/repos/' + organization + '/' + repository + '/commits', {}, function (err, status, body, headers) {

                if(body.message !== "Git Repository is empty.") {

                    body.forEach(function (commit) {

                        var commitJSON = {
                            type: "Commit",
                            organization: organization,
                            repository: repository,
                            author: commit.author.login,
                            message: commit.commit.message,
                            read: false
                        };
                        commitJSON = JSON.stringify(commitJSON);
                        console.log(commitJSON); //Save to database
                    });
                }
            });
        }

        function releasesToDatabase(organization, repository) {

            client.get('/repos/' + organization + '/' + repository + '/releases', {}, function (err, status, body, headers) {

                if(body.message !== "Git Repository is empty.") {

                    body.forEach(function (release) {
                        var releaseJSON = {
                            type: "Release",
                            organization: organization,
                            repository: repository,
                            author: release.author.login,
                            version: release.tag_name,
                            title: release.name,
                            message: release.body,
                            read: false
                        };
                        releaseJSON = JSON.stringify(releaseJSON);
                        console.log(releaseJSON); //Save to database
                    });

                }
            });
        }

        organizationsToDatabase(req.user.profile.username);
        res.render('dashboard',{profile: req.user.profile.username});

    }
);

module.exports = router;
