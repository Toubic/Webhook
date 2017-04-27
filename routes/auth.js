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

var Commits = mongoose.model('Commits', CommitSchema);
var Releases = mongoose.model('Releases', ReleaseSchema);

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
                    createGithubWebhook(organization.login);
                });

            });
        }

        function createGithubWebhook(organization) {

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

        var webhookPayload = req.body;

        if(webhookPayload.commits) {
            var commit = new Commits({
                type: "Commit",
                organization: webhookPayload.organization.login,
                repository: webhookPayload.repository.name,
                author: webhookPayload.sender.login,
                message: webhookPayload.head_commit.message,
                read: false
            });

            commit.save(function (err) {
                if (err)
                    return console.log(err);
            });
        }
        else {
            var release = new Releases ({
                type: "Release",
                organization: webhookPayload.organization.login,
                repository: webhookPayload.repository.name,
                author: webhookPayload.sender.login,
                version: webhookPayload.release.tag_name,
                title: webhookPayload.release.name,
                message: webhookPayload.release.body,
                read: false
            });
            release.save(function (err) {
                if (err)
                    return console.log(err);
            });
        }
        res.sendStatus(200);
    });

module.exports = router;
