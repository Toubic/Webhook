"use strict";

var express = require("express");
var router = express.Router();
var passport = require("passport");
var octonode = require("octonode");
var mongoose = require("mongoose");
var config = require("./../config/config");
mongoose.connect(config.database.credentials);

var Schema = mongoose.Schema;

var CommitSchema = new Schema({
    type: String,
    organization: String,
    repository: String,
    author: String,
    message: String,
    read: Boolean
});

var ReleaseSchema = new Schema({
    type: String,
    organization: String,
    repository: String,
    author: String,
    version: String,
    title: String,
    message: String,
    read: Boolean
});

var PayloadSchema = new Schema({
    message: String
});

var Commits = mongoose.model('Commits', CommitSchema);
var Releases = mongoose.model('Releases', ReleaseSchema);
var Payloads = mongoose.model('Payloads', PayloadSchema);

var db = mongoose.connection;

if (config.database.credentials === undefined)
    throw new Error("No database credentials given");

router.get("/",
    passport.authenticate('github', { scope: [ 'admin:org_hook' ] }),
    function(req, res){
    });

router.get("/callback",
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

            var ghorg = client.org(organization);

            ghorg.hook({
                "name": "web",
                "active": true,
                "events": ["push", "release"],
                "config": {
                    "url": "https://shrouded-hamlet-39019.herokuapp.com/auth/github/callback",
                    "content_type": "json"
                }
            }, function (err, status, body, headers) {
                console.log(err);
                console.log(status);
                console.log(body);
            });

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

                        var commit = new Commits ({
                            type: "Commit",
                            organization: organization,
                            repository: repository,
                            author: commit.author.login,
                            message: commit.commit.message,
                            read: false
                        });

                        commit.save(function (err) {
                            if (err)
                                return console.log(err);
                        });
                    });
                }
            });
        }

        function releasesToDatabase(organization, repository) {

            client.get('/repos/' + organization + '/' + repository + '/releases', {}, function (err, status, body, headers) {

                if(body.message !== "Git Repository is empty.") {

                    body.forEach(function (release) {
                        var release = new Releases ({
                            type: "Release",
                            organization: organization,
                            repository: repository,
                            author: release.author.login,
                            version: release.tag_name,
                            title: release.name,
                            message: release.body,
                            read: false
                        });
                        release.save(function (err) {
                            if (err)
                                return console.log(err);
                        });
                    });

                }
            });
        }

        organizationsToDatabase(req.user.profile.username);

        Commits.find({}, function(err, commits){
            if(err){
                console.log(err);
            } else{
                res.render('dashboard',{profile: req.user.profile.username, commits: commits});
            }
        }).lean();

    }
);

router.post("/callback",
    function(req, res){

        var pload = JSON.parse(req.body);

        var payload = new Payloads ({
            message: pload.ref
        });

        payload.save(function (err) {
            if (err)
                return console.log(err);
        });
        res.sendStatus(200);
    });

module.exports = router;
